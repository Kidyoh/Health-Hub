import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session'; // Ensure Iron-session is imported

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  // Ensure the user is authenticated
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { sessionId } = req.query;

  try {
    // Fetch the chat session, including diagnoses
    const chatSession = await prisma.chatSession.findUnique({
      where: { id: parseInt(sessionId) },
      include: {
        diagnoses: true, // Include all diagnoses (messages) in the session
      },
    });

    // If the session is not found, return a 404
    if (!chatSession) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Ensure the user requesting the session is the owner of the session
    if (chatSession.userId !== session.id) {
      return res.status(403).json({ error: 'Forbidden: Cannot access other user’s chat session' });
    }

    // Return the chat session and diagnoses
    res.status(200).json({ session: chatSession, diagnoses: chatSession.diagnoses });
  } catch (error) {
    console.error('Error fetching chat session:', error);
    res.status(500).json({ error: 'Failed to fetch chat session' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
});
