import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid'; // For generating unique txRef

const prisma = new PrismaClient();

async function handler(req, res) {
  const { teleconsultationId } = req.body;

  if (!teleconsultationId) {
    return res.status(400).json({ error: 'Teleconsultation ID is required.' });
  }

  try {
    // Step 1: Find the teleconsultation details and associated user
    const teleconsultation = await prisma.teleconsultation.findUnique({
      where: { id: parseInt(teleconsultationId) },
      include: {
        user: true, // Get the user associated with the teleconsultation
      },
    });

    if (!teleconsultation) {
      return res.status(404).json({ error: 'Teleconsultation not found.' });
    }

    // Step 2: Fetch teleconsultor's rate from the Teleconsultor model
    const teleconsultor = await prisma.teleconsultor.findUnique({
      where: {
        userId: teleconsultation.userId, // Assuming userId links to the teleconsultor
      },
    });

    if (!teleconsultor) {
      return res.status(404).json({ error: 'Teleconsultor not found.' });
    }

    const teleconsultorRate = teleconsultor.rate;
    const userAmount = teleconsultorRate; // The amount the user will pay (teleconsultor's rate)
    const teleconsultorAmount = teleconsultorRate * 0.8; // Teleconsultor gets 80%

    // Step 3: Update teleconsultation status to Approved
    await prisma.teleconsultation.update({
      where: { id: parseInt(teleconsultationId) },
      data: { status: 'Approved' },
    });

    // Step 4: Create a unique transaction reference
    const txRef = `TX-${Date.now()}-${uuidv4()}-${teleconsultationId}`;

    // Step 5: Generate PDF receipt
    const receiptFilePath = path.join(__dirname, `../../public/receipts/receipt-${txRef}.pdf`);
    generateReceiptPDF({
      txRef,
      amount: userAmount,
      teleconsultation,
      receiptFilePath,
    });

    // Step 6: Create a transaction for the user
    await prisma.transaction.create({
      data: {
        userId: teleconsultation.userId,
        teleconsultationId: teleconsultation.id,
        txRef,
        status: 'Completed',
        amount: userAmount, // Amount for the user transaction
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Step 7: Create a transaction for the teleconsultor
    await prisma.transaction.create({
      data: {
        userId: teleconsultor.userId, // Teleconsultor's user ID
        teleconsultationId: teleconsultation.id,
        txRef,
        status: 'Completed',
        amount: teleconsultorAmount, // 80% of the rate goes to the teleconsultor
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Step 8: Notify the user and teleconsultor via email
    const receiptUrl = `${process.env.BASE_URL}/receipts/receipt-${txRef}.pdf`;
    await sendEmailWithReceipt({
      to: teleconsultation.user.email,
      subject: `Teleconsultation Receipt - Dr. ${teleconsultation.doctor}`,
      text: `Your teleconsultation with Dr. ${teleconsultation.doctor} has been approved. You can access your receipt here: ${receiptUrl}`,
      receiptFilePath,
    });

    await sendEmailWithReceipt({
      to: teleconsultor.user.email,
      subject: `Teleconsultation Receipt for Dr. ${teleconsultation.doctor}`,
      text: `You have successfully completed a teleconsultation with ${teleconsultation.user.firstName} ${teleconsultation.user.lastName}. You can access your receipt here: ${receiptUrl}`,
      receiptFilePath,
    });

    return res.status(200).json({ success: true, message: 'Teleconsultation approved, transaction created, receipt generated, and emails sent.' });
  } catch (error) {
    console.error('Error updating teleconsultation status or creating transactions:', error);
    return res.status(500).json({ error: 'Failed to process teleconsultation approval and transactions.' });
  }
}

// Generate the receipt PDF
function generateReceiptPDF({ txRef, amount, teleconsultation, receiptFilePath }) {
  const dir = path.dirname(receiptFilePath);

  // Ensure the directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(receiptFilePath));

  doc.fontSize(25).text('Teleconsultation Receipt', { align: 'center' });
  doc.fontSize(14).text(`Transaction Reference: ${txRef}`, { align: 'left' });
  doc.text(`Amount: $${amount}`, { align: 'left' });
  doc.text(`Doctor: Dr. ${teleconsultation.doctor}`, { align: 'left' });
  doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'left' });
  doc.text(`User: ${teleconsultation.user.firstName} ${teleconsultation.user.lastName}`, { align: 'left' });

  doc.text('------------------------------------', { align: 'left' });
  doc.text('Thank you for using our service.', { align: 'center' });

  doc.end();
}

// Nodemailer email sender function
async function sendEmailWithReceipt({ to, subject, text, receiptFilePath }) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
    attachments: [
      {
        filename: path.basename(receiptFilePath),
        path: receiptFilePath,
      },
    ],
  });
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
