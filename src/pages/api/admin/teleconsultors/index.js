import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  // Ensure the user is an admin
  if (!session || session.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const { status, specialties } = req.query;

      // Filters for teleconsultors
      const filters = {};
      if (status) {
        filters.user = { status }; // Filtering by user status
      }
      if (specialties) {
        filters.specialties = {
          contains: specialties, // Partial match on specialties
        };
      }

      // Fetch teleconsultors along with availability and user details
      const teleconsultors = await prisma.teleconsultor.findMany({
        where: filters,
        select: {
          id: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              status: true,
            },
          },
          specialties: true,
          rate: true,
          rating: true,
          workingHours: true,
          createdAt: true,
          Availability: {
            select: {
              dayOfWeek: true,
              startTime: true,
              endTime: true,
            },
          },
        },
      });

      // Map the availability details
      const mappedTeleconsultors = teleconsultors.map(teleconsultor => ({
        id: teleconsultor.id,
        firstName: teleconsultor.user.firstName,
        lastName: teleconsultor.user.lastName,
        email: teleconsultor.user.email,
        status: teleconsultor.user.status,
        specialties: teleconsultor.specialties,
        rate: teleconsultor.rate,
        rating: teleconsultor.rating,
        workingHours: teleconsultor.workingHours,
        createdAt: teleconsultor.createdAt,
        availability: teleconsultor.Availability.map(avail => ({
          dayOfWeek: avail.dayOfWeek,
          startTime: avail.startTime,
          endTime: avail.endTime,
        })),
      }));

      console.log('Mapped Teleconsultors:', JSON.stringify(mappedTeleconsultors, null, 2));

      res.status(200).json({ success: true, teleconsultors: mappedTeleconsultors });
    } catch (error) {
      console.error('Error fetching teleconsultors:', error);
      res.status(500).json({ error: 'Failed to fetch teleconsultors.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
