// /pages/api/teleconsultor/completed-teleconsultations.ts
import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session || session.role !== 'USER') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'GET') {
    try {
      // Fetch teleconsultations with status 'Completed'
      const completedConsultations = await prisma.teleconsultation.findMany({
        where: {
          teleconsultorId: session.id, // Only fetch for the logged-in teleconsultor
          status: 'Completed',        // Filter by status 'Completed'
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      // Respond with the completed consultations
      return res.status(200).json({
        success: true,
        consultations: completedConsultations.map(consultation => ({
          id: consultation.id,
          date: consultation.date,
          doctor: consultation.doctor,
          patientName: `${consultation.user.firstName} ${consultation.user.lastName}`,
          status: consultation.status,
          notes: consultation.notes,
        })),
      });
    } catch (error) {
      console.error('Error fetching completed teleconsultations:', error);
      return res.status(500).json({ error: 'Failed to fetch completed teleconsultations.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
});
