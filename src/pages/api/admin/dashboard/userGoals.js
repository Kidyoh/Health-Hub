import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  // Check if session exists and user is an ADMIN
  if (!session || session.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  if (req.method === 'GET') {
    try {
      // Optional filtering by date range (startDate, endDate)
      const { startDate, endDate } = req.query;

      // Fetch user data (new customers) registered within the date range or last 30 days if not provided
      const filter = {
        createdAt: {
          gte: startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30)), // Default to last 30 days
          lte: endDate ? new Date(endDate) : new Date(), // Default to current date
        },
      };

      const newCustomers = await prisma.user.findMany({
        where: filter,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json({ success: true, newCustomers });
    } catch (error) {
      console.error('Error fetching new customers:', error);
      return res.status(500).json({ error: 'Failed to fetch new customers' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Session management configuration with next-iron-session
export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
