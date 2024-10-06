// /pages/api/appointments/[id].js

import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      await prisma.appointment.delete({
        where: { id: parseInt(id, 10) },
      });
      return res.status(200).json({ success: true, message: 'Appointment canceled successfully.' });
    } catch (error) {
      console.error('Error canceling appointment:', error);
      return res.status(500).json({ error: 'Failed to cancel appointment.' });
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
