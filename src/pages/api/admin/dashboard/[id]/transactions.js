import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  // Check if session exists and user is authenticated
  if (!session) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  const { id } = req.query; // userId from the request URL

  if (req.method === 'GET') {
    try {
      // Fetch transactions associated with the userId
      const transactions = await prisma.transaction.findMany({
        where: {
          userId: parseInt(id),
        },
        select: {
          amount: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      // Calculate total income and monthly earnings
      const totalIncome = transactions.reduce((acc, tx) => acc + tx.amount, 0);

      const monthlyEarnings = transactions.reduce((acc, tx) => {
        const month = new Date(tx.createdAt).getMonth();
        acc[month] = (acc[month] || 0) + tx.amount;
        return acc;
      }, {});

      return res.status(200).json({ success: true, totalIncome, monthlyEarnings });
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
    secure: process.env.NODE_ENV === 'production',
  },
});
