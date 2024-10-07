import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  // Ensure the user is logged in and is an admin
  if (!session || session.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'GET') {
    // Fetch all tickets
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
    const { id, status } = req.body;

    try {
      const updatedTicket = await prisma.supportTicket.update({
        where: { id },
        data: { status },
      });

      // Optionally, send an email to the user about the status update (Email setup later)

      return res.status(200).json({ success: true, ticket: updatedTicket });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      return res.status(500).json({ error: 'Failed to update ticket' });
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
