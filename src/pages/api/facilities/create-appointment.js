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
    const { facilityId, date } = req.body;

    // Validate input
    if (!facilityId || !date) {
      return res.status(400).json({ error: 'Facility and date are required.' });
    }

    const parsedDate = parseISO(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: 'Invalid date format.' });
    }

    try {
      // Create appointment for facility-based consultation
      const appointment = await prisma.appointment.create({
        data: {
          userId: session.id,
          facilityId: parseInt(facilityId, 10), // Link to the facility
          date: parsedDate,
          status: 'Scheduled',
        },
      });

      return res.status(201).json({ success: true, appointment });
    } catch (error) {
      console.error('Error creating facility appointment:', error);
      return res.status(500).json({ error: 'Failed to create facility appointment.' });
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
