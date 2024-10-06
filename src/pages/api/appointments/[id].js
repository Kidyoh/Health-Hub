import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';
import { parseISO } from 'date-fns';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'PUT') {
    const { date, status } = req.body;

    // Validate input
    if (!date && !status) {
      return res.status(400).json({ error: 'Date or status is required.' });
    }

    const parsedDate = date ? parseISO(date) : undefined;
    if (date && isNaN(parsedDate)) {
      return res.status(400).json({ error: 'Invalid date format.' });
    }

    try {
      const updatedAppointment = await prisma.appointment.update({
        where: { id: parseInt(id, 10) },
        data: {
          ...(date && { date: parsedDate }),
          ...(status && { status }),
        },
      });

      return res.status(200).json({ success: true, updatedAppointment });
    } catch (error) {
      console.error('Error updating appointment:', error);
      return res.status(500).json({ error: 'Failed to update appointment.' });
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
