// pages/api/user/index.ts
import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
  // Get the session data for the current user
  const session = req.session.get('user');

  if (!session) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    // Fetch the user from the database using Prisma
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true, 
        status:true // Include the role field
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Respond with the user data including the role
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD, // Ensure this is securely set in .env
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
