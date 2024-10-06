import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const diagnoses = await prisma.diagnosis.findMany({
        where: { chatSessionId: parseInt(id) },
        select: {
          id: true,
          diagnosisText: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      });

      res.status(200).json({ diagnoses });
    } catch (error) {
      console.error('Error fetching chat session diagnoses:', error);
      res.status(500).json({ error: 'Failed to fetch chat session diagnoses' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
