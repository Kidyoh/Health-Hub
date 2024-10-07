import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  // Ensure the user is an admin
  if (!session || session.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      let { startDate, endDate, teleconsultationId } = req.query;

      // Filters object
      const filters = {};

      // Validate and use startDate and endDate only if they are valid
      if (startDate && !isNaN(Date.parse(startDate))) {
        filters.createdAt = {
          ...filters.createdAt,
          gte: new Date(startDate),
        };
      }

      if (endDate && !isNaN(Date.parse(endDate))) {
        filters.createdAt = {
          ...filters.createdAt,
          lte: new Date(endDate),
        };
      }

      // Optional filter for teleconsultationId
      if (teleconsultationId) {
        filters.teleconsultationId = parseInt(teleconsultationId);
      }

      // Fetch transactions from Prisma
      const transactions = await prisma.transaction.findMany({
        where: filters,
        select: {
          id: true,
          amount: true,
          txRef: true,
          teleconsultationId: true,
          userId: true,
          createdAt: true,
        },
      });

      // Group by teleconsultationId and map the payments
      const groupedTransactions = transactions.reduce((acc, transaction) => {
        const { teleconsultationId, amount, txRef } = transaction;

        if (!acc[teleconsultationId]) {
          acc[teleconsultationId] = {
            teleconsultationId,
            userPaid: 0,
            teleconsultorReceived: 0,
            adminReceived: 0,
            createdAt: transaction.createdAt,
          };
        }

        if (txRef.startsWith('TX-USER')) {
          acc[teleconsultationId].userPaid += amount;
        } else if (txRef.startsWith('TX-TELECONSULTOR')) {
          acc[teleconsultationId].teleconsultorReceived += amount;
        } else if (txRef.startsWith('TX-ADMIN')) {
          acc[teleconsultationId].adminReceived += amount;
        }

        return acc;
      }, {});

      // Convert the result to an array for easier handling
      const financialData = Object.values(groupedTransactions);

      res.status(200).json({ success: true, financialData });
    } catch (error) {
      console.error('Error fetching financial reports:', error);
      res.status(500).json({ error: 'Failed to fetch financial reports.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});