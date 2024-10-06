import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  try {
    // Retrieve user session
    const session = req.session.get('user');

    if (!session) {
      // If no user session exists, return unauthorized
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch notifications for the logged-in user
    const notifications = await prisma.notification.findMany({
      where: { userId: session.id },
      orderBy: { date: 'desc' }, // Order notifications by most recent
    });

    // Check if notifications were fetched successfully
    if (!notifications) {
      return res.status(404).json({ success: false, message: 'No notifications found.' });
    }

    // Return the fetched notifications
    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
