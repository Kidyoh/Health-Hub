// /api/admin/users/add.ts
import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  // Check if the user is an admin
  if (!session || session.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role,
          status: 'PENDING', // New user starts as pending
        },
      });

      return res.status(201).json({ success: true, user: newUser });
    } catch (error) {
      console.error('Error adding user:', error);
      return res.status(500).json({ error: 'Failed to add user' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
});
