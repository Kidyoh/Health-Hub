import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
    const { firstName, lastName, email, password } = req.body;

    try {
      const updatedUser = await prisma.user.update({
        where: { id: session.id },
        data: {
          firstName,
          lastName,
          email,
          ...(password && { password: await bcrypt.hash(password, 10) }),
        },
      });

      res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile.' });
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
