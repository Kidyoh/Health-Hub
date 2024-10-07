import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  console.log('Request received:', req.method, req.url);
  
  const session = req.session.get('user');
  console.log('Session:', session);

  // Ensure the user is logged in and is a teleconsultor
  if (!session || session.role !== 'TELECONSULTER') {
    console.log('Unauthorized access attempt:', session);
    return res.status(403).json({ error: 'Forbidden: Unauthorized user role' });
  }

  try {
    // Fetch the teleconsultor details using the user ID from the session
    const teleconsultor = await prisma.teleconsultor.findUnique({
      where: { userId: session.id },
    });
    console.log('Teleconsultor:', teleconsultor);

    if (!teleconsultor) {
      console.log('Teleconsultor not found for user ID:', session.id);
      return res.status(404).json({ error: 'Teleconsultor not found' });
    }

    // Fetch upcoming consultations where teleconsultorId matches and status is 'Approved' or 'In Progress'
    const consultations = await prisma.teleconsultation.findMany({
      where: {
        teleconsultorId: teleconsultor.id, // Match by teleconsultorId
        status: {
          in: ['Approved', 'In Progress'], // Include both 'Approved' and 'In Progress' statuses
        },
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
    console.log('Consultations:', consultations);

    if (consultations.length === 0) {
      console.log('No upcoming consultations found for teleconsultor ID:', teleconsultor.id);
      return res.status(200).json({
        success: true,
        consultations: [],
        message: 'No upcoming consultations.',
      });
    }

    // Map consultations to return relevant details
    const consultationDetails = consultations.map((consultation) => ({
      id: consultation.id,
      patientName: `${consultation.user.firstName} ${consultation.user.lastName}`,
      email: consultation.user.email,
      date: consultation.date,
      status: consultation.status,
    }));
    console.log('Consultation details:', consultationDetails);

    return res.status(200).json({
      success: true,
      consultations: consultationDetails,
    });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return res.status(500).json({ error: 'Internal server error: Failed to fetch consultations.' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
});