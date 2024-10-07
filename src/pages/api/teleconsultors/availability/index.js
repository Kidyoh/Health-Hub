// /api/teleconsultor/availability/index.ts
import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  // Check if the user is a teleconsultor
  if (!session || session.role !== 'TELECONSULTER') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const teleconsultorId = session.id;

  if (req.method === 'POST') {
    const { dayOfWeek, startTime, endTime } = req.body;

    try {
      const availability = await prisma.availability.create({
        data: {
          teleconsultorId,
          dayOfWeek,
          startTime,
          endTime,
        },
      });

      return res.status(200).json({ success: true, availability });
    } catch (error) {
      console.error('Error creating availability:', error);
      return res.status(500).json({ error: 'Error creating availability' });
    }
  }

  if (req.method === 'PUT') {
    const { id, dayOfWeek, startTime, endTime } = req.body;

    try {
      const availability = await prisma.availability.update({
        where: { id },
        data: {
          dayOfWeek,
          startTime,
          endTime,
        },
      });

      return res.status(200).json({ success: true, availability });
    } catch (error) {
      console.error('Error updating availability:', error);
      return res.status(500).json({ error: 'Error updating availability' });
    }
  }

if (req.method === 'GET') {
    try {
      const availability = await prisma.availability.findMany({
        where: {
          teleconsultorId,
        },
        orderBy: {
          dayOfWeek: 'asc', // Order by day of the week
        },
      });
  
      return res.status(200).json({ success: true, availability });
    } catch (error) {
      console.error('Error fetching availability:', error);
      return res.status(500).json({ error: 'Error fetching availability' });
    }
  }
  

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
});
