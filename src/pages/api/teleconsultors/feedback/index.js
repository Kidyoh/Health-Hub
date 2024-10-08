import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
      const session = req.session.get('user');

      if (!session || session.role !== 'TELECONSULTER') {
            return res.status(403).json({ error: 'Forbidden' });
      }

      try {
            // Find the teleconsultor linked to the session's user ID
            const teleconsultor = await prisma.teleconsultor.findUnique({
                  where: { userId: session.id },
            });

            if (!teleconsultor) {
                  return res.status(404).json({ error: 'Teleconsultor not found.' });
            }

            // Fetch feedback related to the teleconsultor's completed teleconsultations
            const feedbacks = await prisma.feedback.findMany({
                  where: {
                        teleconsultation: {
                              teleconsultorId: teleconsultor.id,
                        },
                  },
                  include: {
                        teleconsultation: {
                              select: {
                                    doctor: true,
                                    status: true,
                                    user: {
                                          select: {
                                                firstName: true,
                                                lastName: true,
                                          },
                                    },
                              },
                        },
                  },
            });

            return res.status(200).json({
                  success: true,
                  feedbacks: feedbacks.map(fb => ({
                        id: fb.id,
                        patientName: `${fb.teleconsultation.user.firstName} ${fb.teleconsultation.user.lastName}`,
                        doctor: fb.teleconsultation.doctor,
                        feedback: fb.content,
                        rating: fb.rating,
                        status: fb.teleconsultation.status,
                        date: fb.createdAt,
                  })),
            });
      } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to fetch feedback.' });
      }
}

export default withIronSession(handler, {
      password: process.env.SECRET_COOKIE_PASSWORD,
      cookieName: 'next-iron-session/login',
      cookieOptions: { secure: process.env.NODE_ENV === 'production' },
});
