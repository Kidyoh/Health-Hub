// /api/teleconsultor/availability/[id].ts
import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session || session.role !== 'TELECONSULTER') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      await prisma.availability.delete({
        where: {
          id: parseInt(id, 10),
        },
      });

      return res.status(200).json({ success: true, message: 'Availability deleted.' });
    } catch (error) {
      console.error('Error deleting availability:', error);
      return res.status(500).json({ error: 'Error deleting availability' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
});
