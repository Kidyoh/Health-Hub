// /pages/api/teleconsultor/consultations/upcoming.ts
import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  // Check if the user is logged in and is a teleconsultor
  if (!session || session.role !== 'TELECONSULTER') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    // Find the teleconsultor by userId (from session)
    const teleconsultor = await prisma.teleconsultor.findUnique({
      where: { userId: session.id }, // Match by session user ID
    });

    if (!teleconsultor) {
      return res.status(404).json({ error: 'Teleconsultor not found' });
    }

    // Fetch upcoming consultations where teleconsultorId matches and status is 'Upcoming'
    const consultations = await prisma.teleconsultation.findMany({
      where: {
        teleconsultorId: teleconsultor.id, // Match consultations by teleconsultorId
        status: 'Approved', // Only get upcoming consultations
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true, // Fetch essential details of the patient (user)
          },
        },
      },
    });

    // Map consultations to include only necessary details for response
    const consultationDetails = consultations.map((consultation) => ({
      id: consultation.id,
      patientName: `${consultation.user.firstName} ${consultation.user.lastName}`,
      email: consultation.user.email, // Include patient's email
      date: consultation.date,
      status: consultation.status,
    }));

    // Return successful response with consultation details
    return res.status(200).json({
      success: true,
      consultations: consultationDetails,
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
