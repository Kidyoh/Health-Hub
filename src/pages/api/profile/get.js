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
      // Fetch user with all related details (teleconsultor, healthcare, etc.)
      const user = await prisma.user.findUnique({
        where: { id: session.id },
        include: {
          teleconsultor: true,
          healthcareFacility: true,
          appointments: true,
          notifications: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to retrieve profile.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed.' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
});
