import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session || session.role !== 'USER') {
    return res.status(401).json({ error: 'Unauthorized: User not logged in or invalid role' });
  }

  const userId = session.id; // Get userId from session
  const { teleconsultationId } = req.query; // Optionally get teleconsultationId from query parameters

  if (req.method === 'GET') {
    try {
      // Build the query filter condition based on userId and optional teleconsultationId
      const filterCondition = { userId: parseInt(userId) };

      // If teleconsultationId is provided, include it in the filter condition
      if (teleconsultationId) {
        filterCondition.teleconsultationId = parseInt(teleconsultationId);
      }

      // Fetch prescriptions for the user
      const prescriptions = await prisma.prescription.findMany({
        where: filterCondition,
        orderBy: {
          createdAt: 'desc', // Sort by creation date
        },
        select: {
          id: true,
          doctor: true,
          medicines: true,
          dosage: true,
          teleconsultationId: true, // Include teleconsultationId in the response
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!prescriptions || prescriptions.length === 0) {
        return res.status(404).json({ error: 'No prescriptions found for this user or teleconsultation' });
      }

      res.status(200).json(prescriptions);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      res.status(500).json({ error: 'Error fetching prescriptions' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
});
