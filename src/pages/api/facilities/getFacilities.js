// /pages/api/facilities/getFacilities.ts
import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
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

    return res.status(200).json({ success: true, facilities });
  } catch (error) {
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
