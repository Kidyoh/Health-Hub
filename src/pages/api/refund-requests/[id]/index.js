import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session || session.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'PATCH') {
    const { status, adminResponse } = req.body;
    const { id } = req.query; // Extract the `id` from the query parameters

    if (!id) {
      return res.status(400).json({ error: 'Missing refund request ID' });
    }

    try {
      // Update the refund request status and admin's response
      const updatedRefund = await prisma.refundRequest.update({
        where: { id: parseInt(id) }, // Ensure `id` is an integer
        data: { status, adminResponse },
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true },
          },
        },
      });

      // Prepare a custom email message based on the refund status
      let emailMessage = `Dear ${updatedRefund.user.firstName} ${updatedRefund.user.lastName},\n\n`;
      switch (status) {
        case 'APPROVED':
          emailMessage += `Good news! Your refund request for transaction #${updatedRefund.transactionId} has been approved. The refund will be processed soon.\n\n`;
          break;
        case 'REJECTED':
          emailMessage += `We regret to inform you that your refund request for transaction #${updatedRefund.transactionId} has been rejected.\n\n`;
          break;
        default:
          emailMessage += `Your refund request for transaction #${updatedRefund.transactionId} has been updated with the status: ${status}.\n\n`;
      }

      // Append any custom admin response
      if (adminResponse) {
        emailMessage += `Message from the admin: ${adminResponse}\n\n`;
      }

      emailMessage += `Best regards,\nSupport Team`;

      // Send email notification to the user
      await sendEmail(updatedRefund.user.email, 'Refund Request Status Updated', emailMessage);

      return res.status(200).json({ success: true, refund: updatedRefund });
    } catch (error) {
      console.error('Error updating refund request:', error);
      return res.status(500).json({ error: 'Failed to update refund request' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Utility function to send an email using Nodemailer
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
