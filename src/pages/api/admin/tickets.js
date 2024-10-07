import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';
import nodemailer from 'nodemailer'; // Make sure you have nodemailer installed

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  // Ensure the user is logged in and is an admin
  if (!session || session.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Handle GET request to fetch all tickets
  if (req.method === 'GET') {
    try {
      const tickets = await prisma.supportTicket.findMany({
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true }, // Include user details for tickets
          },
        },
      });

      return res.status(200).json({ success: true, tickets });
    } catch (error) {
      console.error('Error fetching tickets:', error);
      return res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  }

  // Handle PATCH request to update ticket status
  if (req.method === 'PATCH') {
    const { id, status } = req.body;

    try {
      // Update the ticket status
      const updatedTicket = await prisma.supportTicket.update({
        where: { id: parseInt(id) },
        data: { status },
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true }, // Fetch user details for the email
          },
        },
      });

      // Send email notification to the user about the status update
      await sendEmail(
        updatedTicket.user.email, // The user's email
        'Support Ticket Status Updated',
        `Dear ${updatedTicket.user.firstName} ${updatedTicket.user.lastName},\n\nYour support ticket titled "${updatedTicket.title}" has been updated to: ${status}.\n\nBest Regards,\nSupport Team`
      );

      return res.status(200).json({ success: true, ticket: updatedTicket });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      return res.status(500).json({ error: 'Failed to update ticket' });
    }
  }

  // Return 405 for other methods
  return res.status(405).json({ error: 'Method not allowed' });
}

// Utility function to send an email using Nodemailer
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can configure this to any service (Gmail, SMTP, etc.)
    auth: {
      user: process.env.GMAIL_USER, // Use your environment variables
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER, // Sender's email address
    to, // Receiver's email
    subject, // Subject of the email
    text, // Email content (plain text)
  };

  try {
    await transporter.sendMail(mailOptions); // Send email
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
