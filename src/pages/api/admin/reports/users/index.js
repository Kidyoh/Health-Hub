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
      let { startDate, endDate, userId } = req.query;

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

      // Optional filter for userId
      if (userId) {
        filters.id = parseInt(userId);
      }

      // Fetch user activity data
      const userReports = await prisma.user.findMany({
        where: filters,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          teleconsultations: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      });

      // Mapping data to summarize activity
      const mappedReports = userReports.map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        registrationDate: user.createdAt,
        totalTeleconsultations: user.teleconsultations.length,
        completedTeleconsultations: user.teleconsultations.filter(
          (consultation) => consultation.status === 'COMPLETED'
        ).length,
        missedTeleconsultations: user.teleconsultations.filter(
          (consultation) => consultation.status === 'MISSED'
        ).length,
      }));

      res.status(200).json({ success: true, userReports: mappedReports });
    } catch (error) {
      console.error('Error fetching user reports:', error);
      res.status(500).json({ error: 'Failed to fetch user reports.' });
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
