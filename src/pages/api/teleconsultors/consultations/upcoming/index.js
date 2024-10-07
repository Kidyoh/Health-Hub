// /pages/api/teleconsultor/consultations/upcoming.ts
import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  // Ensure the user is logged in and is a teleconsultor
  if (!session || session.role !== 'TELECONSULTER') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    // Find the teleconsultor record by user ID (session.id)
    const teleconsultor = await prisma.teleconsultor.findUnique({
      where: { userId: session.id },
    });

    if (!teleconsultor) {
      return res.status(404).json({ error: 'Teleconsultor not found' });
    }

    // Fetch upcoming consultations linked with the teleconsultorId
    const consultations = await prisma.teleconsultation.findMany({
      where: {
        teleconsultorId: teleconsultor.id, // Link by teleconsultorId
        status: 'Upcoming', // Only fetch upcoming consultations
      },
      include: {
        user: true, // Include user details (patient details)
      },
    });

    // Return consultations with necessary details
    return res.status(200).json({
      success: true,
      consultations: consultations.map(c => ({
        id: c.id,
        patientName: `${c.user.firstName} ${c.user.lastName}`,
        date: c.date,
        time: c.time, // Assuming you have a 'time' field in Teleconsultation model
        status: c.status,
      })),
    });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return res.status(500).json({ error: 'Failed to fetch consultations.' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
});
