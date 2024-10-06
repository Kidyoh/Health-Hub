import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.id;

  if (req.method === 'GET') {
    try {
      // Fetch the user based on the role and include related data
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          teleconsultor: true,
          healthcareFacility: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ success: true, user });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({ error: 'Error fetching user profile' });
    }
  }

  if (req.method === 'PUT') {
    const {
      firstName,
      lastName,
      location,
      phone,
      rate,
      doctorInfo,
      specialties,
      workingHours,
      services,
      hours,
      contact,
      type,
    } = req.body;

    try {
      // Update basic user fields
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          location,
          phone,
        },
      });

      // If the user is a TELECONSULTER, update teleconsultor-related data
      if (session.role === 'TELECONSULTER') {
        await prisma.teleconsultor.update({
          where: { userId },
          data: {
            rate,
            doctorInfo,
            specialties,
            workingHours,
          },
        });
      }

      // If the user is a HEALTHCARE_FACILITY, update healthcare facility-related data
      if (session.role === 'HEALTHCARE_FACILITY') {
        await prisma.healthcareFacility.update({
          where: { userId },
          data: {
            services,
            location,
            hours,
            contact,
            type,
          },
        });
      }

      return res.status(200).json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error updating user profile:', error);
      return res.status(500).json({ error: 'Error updating user profile' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
});
