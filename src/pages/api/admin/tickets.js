import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session || session.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'GET') {
    try {
      const tickets = await prisma.supportTicket.findMany({
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true },
          },
        },
      });

      return res.status(200).json({ success: true, tickets });
    } catch (error) {
      console.error('Error fetching tickets:', error);
      return res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  }

  if (req.method === 'PATCH') {
    const { id, status, message } = req.body;

    try {
      // Update the ticket status
      const updatedTicket = await prisma.supportTicket.update({
        where: { id: parseInt(id) },
        data: { status },
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true },
          },
        },
      });

      // Prepare a custom email message based on status
      let emailMessage = `Dear ${updatedTicket.user.firstName} ${updatedTicket.user.lastName},\n\n`;
      switch (status) {
        case 'Resolved':
          emailMessage += `Good news! Your support ticket titled "${updatedTicket.title}" has been resolved. If you need further assistance, feel free to reply to this email.\n\n`;
          break;
        case 'Closed':
          emailMessage += `Your support ticket titled "${updatedTicket.title}" has been closed. If you have any other issues, please don't hesitate to reach out.\n\n`;
          break;
        default:
          emailMessage += `Your support ticket titled "${updatedTicket.title}" has been updated to: ${status}.\n\n`;
      }

      // Append any custom message the admin wants to include
      if (message) {
        emailMessage += `Message from the admin: ${message}\n\n`;
      }

      emailMessage += `Best regards,\nSupport Team`;

      // Send email notification to the user
      await sendEmail(updatedTicket.user.email, 'Support Ticket Status Updated', emailMessage);

      return res.status(200).json({ success: true, ticket: updatedTicket });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      return res.status(500).json({ error: 'Failed to update ticket' });
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
