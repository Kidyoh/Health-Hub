import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  // Ensure the user is logged in
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.id;

  if (req.method === 'POST') {
    const { title, message } = req.body;

    try {
      const newTicket = await prisma.supportTicket.create({
        data: {
          userId,
          title,
          message,
        },
      });

      // Optionally, send an email to the admin about the new ticket (Email setup later)

      return res.status(201).json({ success: true, ticket: newTicket });
    } catch (error) {
      console.error('Error creating ticket:', error);
      return res.status(500).json({ error: 'Failed to create ticket' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
