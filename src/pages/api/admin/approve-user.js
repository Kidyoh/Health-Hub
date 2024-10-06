import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session || session.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
      const user = await prisma.user.update({
        where: { id: parseInt(userId, 10) },
        data: { status: 'APPROVED' },
      });

      res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ error: 'Failed to approve user.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
