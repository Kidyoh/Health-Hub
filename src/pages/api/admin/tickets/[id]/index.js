import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  // Ensure the user is logged in and is an admin
  if (!session || session.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Fetch ticket details by ID
  if (req.method === 'GET') {
    const { id } = req.query;

    try {
      const ticket = await prisma.supportTicket.findUnique({
        where: { id: parseInt(id) }, // Parse the ID as an integer
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true }, // Include user details for the ticket
          },
        },
      });

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      return res.status(200).json({ success: true, ticket });
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      return res.status(500).json({ error: 'Failed to fetch ticket details' });
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
