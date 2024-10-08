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

      // Fetch transaction data, optionally filtered by date
      const transactions = await prisma.transaction.findMany({
        where: {
          createdAt: {
            gte: startDate ? new Date(startDate) : undefined,
            lte: endDate ? new Date(endDate) : undefined,
          },
        },
        select: {
          id: true,
          amount: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      return res.status(200).json({ success: true, transactions });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return res.status(500).json({ error: 'Failed to fetch transactions' });
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
    secure: process.env.NODE_ENV === "production",
  },
});
