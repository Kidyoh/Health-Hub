import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';  // Ensure Iron-session is imported

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  // Ensure the user is authenticated
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { userId } = req.query; // Fetch userId from query string

  // Validate that the user is accessing their own data
  if (!userId || parseInt(userId) !== session.id) {
    return res.status(403).json({ error: 'Forbidden: Cannot access other user data' });
  }

  try {
    const sessions = await prisma.chatSession.findMany({
      where: { userId: parseInt(userId) },
      select: {
        id: true,
        sessionName: true,
        createdAt: true,
      },
    });

    res.status(200).json({ sessions });
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    res.status(500).json({ error: 'Failed to fetch chat sessions' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
});
