import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      req.session.set('user', { id: user.id, email: user.email, role: user.role });
      await req.session.save();
      res.status(200).json({ success: true, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Login failed.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
