import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session || session.role !== 'TELECONSULTER') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const teleconsultor = await prisma.teleconsultor.findUnique({
    where: { userId: session.id },
  });

  try {
    const consultations = await prisma.teleconsultation.findMany({
      where: {
        teleconsultorId: teleconsultor.id, // Match by teleconsultorId
        status: "Completed", // Include only 'Completed' consultations
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

    // Format date and time separately before sending the response
    return res.status(200).json({
      success: true,
      consultations: consultations.map(c => {
        const consultationDate = new Date(c.date);
        const formattedDate = consultationDate.toLocaleDateString(); // e.g., '10/07/2024'
        const formattedTime = consultationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // e.g., '08:58 AM'

        return {
          id: c.id,
          patientName: `${c.user.firstName} ${c.user.lastName}`,
          date: formattedDate,  // formatted date string
          time: formattedTime,  // formatted time string
          status: c.status,
        };
      }),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch consultation history.' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
});
