import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session || session.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const refundRequests = await prisma.refundRequest.findMany({
      include: {
        user: true,
        transaction: true,
      },
    });

    return res.status(200).json({ success: true, refundRequests });
  } catch (error) {
    console.error('Error fetching refund requests:', error);
    return res.status(500).json({ error: 'Error fetching refund requests' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
});
