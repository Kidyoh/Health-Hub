import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Fetch all approved teleconsultors
    const teleconsultors = await prisma.user.findMany({
      where: {
        role: 'TELECONSULTER', // Ensure we're only fetching Teleconsultors
        status: 'APPROVED',   
      },
      select: {
        firstName: true,
        lastName: true,
        Teleconsultor: {          // Correct reference to the Teleconsultor relation
          select: {
            id: true,
            rate: true,
            rating: true,
          },
        },
      },
    });

    return res.status(200).json({ success: true, teleconsultors });
  } catch (error) {
    console.error('Error fetching teleconsultors:', error);
    return res.status(500).json({ error: 'Failed to fetch teleconsultors' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
