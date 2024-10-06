import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
    
      const telemedicineAppointments = await prisma.appointment.findMany({
        where: { userId: session.id, teleconsultationId: { not: null } , status: 'Pending' }, 
        include: { teleconsultation: true },
      });

      const facilityAppointments = await prisma.appointment.findMany({
        where: { userId: session.id, facilityId: { not: null } },
        include: { facility: true }, // Only fetch facility-based appointments
      });

      return res.status(200).json({
        success: true,
        telemedicineAppointments,
        facilityAppointments,
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return res.status(500).json({ error: 'Failed to retrieve appointments.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
