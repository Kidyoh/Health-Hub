import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer'; // For sending emails

const prisma = new PrismaClient();

async function handler(req, res) {
  const { teleconsultationId } = req.body;

  console.log("Received teleconsultationId:", teleconsultationId); // Log the incoming ID

  if (!teleconsultationId) {
    console.log("Teleconsultation ID is missing."); // Log missing ID
    return res.status(400).json({ error: 'Teleconsultation ID is required.' });
  }

  try {
    // Step 1: Find the teleconsultation details and associated user
    const teleconsultation = await prisma.teleconsultation.findUnique({
      where: { id: parseInt(teleconsultationId) },
      include: {
        user: true, // Get the user associated with the teleconsultation
        teleconsultor: { include: { user: true } }, // Get teleconsultor and linked user details
      },
    });

    console.log("Teleconsultation found:", teleconsultation); // Log the teleconsultation data

    if (!teleconsultation) {
      console.log("Teleconsultation not found."); // Log not found error
      return res.status(404).json({ error: 'Teleconsultation not found.' });
    }

    // If the teleconsultation is already approved, skip further updates
    if (teleconsultation.status === 'Approved') {
      console.log("Teleconsultation is already approved."); // Log approved status
      return res.status(200).json({ success: true, message: 'Teleconsultation is already approved.' });
    }

    // Step 2: Check if the teleconsultor exists
    const teleconsultor = teleconsultation.teleconsultor;
    if (!teleconsultor) {
      console.log("Teleconsultor details not found."); // Log not found error
      return res.status(404).json({ error: 'Teleconsultor details not found.' });
    }

    const teleconsultorRate = teleconsultor.rate;
    const userAmount = teleconsultorRate; // The amount the user will pay (teleconsultor's rate)
    const teleconsultorAmount = teleconsultorRate * 0.8; // Teleconsultor gets 80%
    const adminAmount = teleconsultorRate * 0.2; // Admin gets 20%

    console.log("Calculated amounts - User Amount:", userAmount, "Teleconsultor Amount:", teleconsultorAmount, "Admin Amount:", adminAmount);

    // Step 3: Update teleconsultation status to Approved
    await prisma.teleconsultation.update({
      where: { id: parseInt(teleconsultationId) },
      data: { status: 'Approved' },
    });

    console.log("Teleconsultation status updated to Approved.");

    // Step 4: Create unique transaction references
    const userTxRef = `TX-USER-${Date.now()}-${teleconsultationId}`;
    const teleconsultorTxRef = `TX-TELECONSULTOR-${Date.now()}-${teleconsultationId}`;
    const adminTxRef = `TX-ADMIN-${Date.now()}-${teleconsultationId}`;
    console.log("Transaction references generated:", { userTxRef, teleconsultorTxRef, adminTxRef });

    // Step 5: Generate PDF receipt
    const receiptFilePath = generateReceiptPDF({
      txRef: userTxRef,
      amount: userAmount,
      teleconsultation,
    });
    console.log("PDF receipt generated at:", receiptFilePath);

    // Step 6: Create a transaction for the user
    const userTransaction = await prisma.transaction.create({
      data: {
        userId: teleconsultation.userId,
        teleconsultationId: teleconsultation.id,
        txRef: userTxRef,
        status: 'Completed',
        amount: userAmount, // Amount for the user transaction
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("User transaction created:", userTransaction); // Log the created transaction

    // Step 7: Create a transaction for the teleconsultor
    const teleconsultorTransaction = await prisma.transaction.create({
      data: {
        userId: teleconsultor.userId, // Teleconsultor's user ID
        teleconsultationId: teleconsultation.id,
        txRef: teleconsultorTxRef,
        status: 'Completed',
        amount: teleconsultorAmount, // 80% of the rate goes to the teleconsultor
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("Teleconsultor transaction created:", teleconsultorTransaction); // Log the created transaction

    // Step 8: Create a transaction for the admin (deduction)
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }, // Assuming there is an admin in the system
    });

    const adminTransaction = await prisma.transaction.create({
      data: {
        userId: adminUser.id, // Admin's user ID
        teleconsultationId: teleconsultation.id,
        txRef: adminTxRef,
        status: 'Completed',
        amount: adminAmount, // Admin receives 20%
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("Admin transaction created:", adminTransaction); // Log the created transaction

    // Step 9: Notify the user and teleconsultor via email
    const receiptUrl = `${process.env.BASE_URL}/receipts/receipt-${userTxRef}.pdf`;

    // Sending email to user
    await sendEmailWithReceipt({
      to: teleconsultation.user.email,
      subject: `Teleconsultation Receipt - Dr. ${teleconsultation.doctor}`,
      text: `Your teleconsultation with Dr. ${teleconsultation.doctor} has been approved. You can access your receipt here: ${receiptUrl}`,
      receiptFilePath,
    });
    console.log("Email sent to user:", teleconsultation.user.email);

    // Sending email to teleconsultor
    await sendEmailWithReceipt({
      to: teleconsultor.user.email,
      subject: `Teleconsultation Receipt for Dr. ${teleconsultation.doctor}`,
      text: `You have successfully completed a teleconsultation with ${teleconsultation.user.firstName} ${teleconsultation.user.lastName}. You can access your receipt here: ${receiptUrl}`,
      receiptFilePath,
    });
    console.log("Email sent to teleconsultor:", teleconsultor.user.email);

    return res.status(200).json({ success: true, message: 'Teleconsultation approved, transactions created, receipt generated, and emails sent.' });
  } catch (error) {
    console.error('Error updating teleconsultation status or creating transactions:', error); // Log any errors
    return res.status(500).json({ error: 'Failed to process teleconsultation approval and transactions.' });
  }
}

// Generate the receipt PDF
function generateReceiptPDF({ txRef, amount, teleconsultation }) {
  const receiptDirectory = path.resolve('./public/receipts');
  if (!fs.existsSync(receiptDirectory)) {
    fs.mkdirSync(receiptDirectory, { recursive: true });
    console.log("Receipt directory created:", receiptDirectory);
  }

  const receiptFile = path.join(receiptDirectory, `receipt-${txRef}.pdf`);

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(receiptFile));

  doc.fontSize(25).text('Teleconsultation Receipt', { align: 'center' });
  doc.fontSize(14).text(`Transaction Reference: ${txRef}`, { align: 'left' });
  doc.text(`Amount: $${amount}`, { align: 'left' });
  doc.text(`Doctor: Dr. ${teleconsultation.doctor}`, { align: 'left' });
  doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'left' });
  doc.text(`User: ${teleconsultation.user.firstName} ${teleconsultation.user.lastName}`, { align: 'left' });

  doc.text('------------------------------------', { align: 'left' });
  doc.text('Thank you for using our service.', { align: 'center' });

  doc.end();

  console.log("Receipt PDF generated successfully at:", receiptFile);

  return receiptFile; // Return the receipt file path
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
    from: process.env.GMAIL_USER, // Sender email address
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
