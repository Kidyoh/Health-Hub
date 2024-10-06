import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
