// /pages/api/teleconsultor/consultations/history.ts
import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session || session.role !== 'TELECONSULTER') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const consultations = await prisma.teleconsultation.findMany({
      where: {
        teleconsultorId: session.id,
        status: 'Completed',
      },
      include: {
        user: true,
      },
    });

    return res.status(200).json({
      success: true,
      consultations: consultations.map(c => ({
        id: c.id,
        patientName: `${c.user.firstName} ${c.user.lastName}`,
        date: c.date,
        time: c.time,
        status: c.status,
      })),
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
