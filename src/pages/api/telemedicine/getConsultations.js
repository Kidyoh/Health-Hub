// /pages/api/telemedicine/getConsultations.js

import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Fetch only approved teleconsultations for the logged-in user
    const teleconsultations = await prisma.teleconsultation.findMany({
      where: {
        userId: session.id,
        status: {
          in: ['Approved', 'In Progress'],
        },
      },
      select: {
        id: true,
        doctor: true,
        date: true,
        status: true,
      },
    });

    return res.status(200).json({ success: true, teleconsultations });
  } catch (error) {
    console.error('Error fetching teleconsultations:', error);
    return res.status(500).json({ error: 'Failed to fetch teleconsultations' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
