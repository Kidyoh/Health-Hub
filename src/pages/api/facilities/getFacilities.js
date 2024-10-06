import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  console.log('Received request for getFacilities API');
  const session = req.session.get('user');

  if (!session) {
    console.log('Unauthorized access attempt');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('Fetching approved healthcare facilities and pharmacies');
    const facilities = await prisma.healthcareFacility.findMany({
      where: {
        user: {
          status: 'APPROVED',
        },
      },
      select: {
        id: true,
        name: true,
        location: true,
        services: true,
        contact: true,
        type: true,
      },
    });

    console.log('Fetched facilities:', facilities);
    return res.status(200).json({ success: true, facilities });
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return res.status(500).json({ error: 'Failed to fetch facilities' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});