import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session'; 

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.id;

  if (req.method === 'GET') {
    try {
      const transactions = await prisma.transaction.findMany({
        where: { userId },
        include: {
          appointment: true,
          teleconsultation: true,
        },
      });

      return res.status(200).json({ transactions });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return res.status(500).json({ error: 'Error fetching transactions' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
});
