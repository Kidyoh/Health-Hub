import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';
import { parseISO } from 'date-fns';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { doctor, date } = req.body;

    // Validate input
    if (!doctor || !date) {
      return res.status(400).json({ error: 'Doctor and date are required.' });
    }

    const parsedDate = parseISO(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: 'Invalid date format.' });
    }

    try {
      const teleconsultation = await prisma.teleconsultation.create({
        data: {
          userId: session.id,
          doctor,
          date: parsedDate,
          status: 'Pending',
        },
      });

      return res.status(201).json({ success: true, teleconsultation });
    } catch (error) {
      console.error('Error starting telemedicine consultation:', error);
      return res.status(500).json({ error: 'Failed to start telemedicine consultation.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
