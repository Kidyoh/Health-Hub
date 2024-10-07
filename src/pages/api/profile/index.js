import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';  // Ensure this is imported

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.id;

  if (req.method === 'GET') {
    try {
      const includeData = {
        appointments: true,
        teleconsultations: true,
        notifications: true,
        feedback: true,
        prescriptions: true,
      };

      // Add Teleconsultor data if the user is a TELECONSULTER
      if (session.role === 'TELECONSULTER') {
        includeData.Teleconsultor = true;
      }

      // Add HealthcareFacility data if the user is a HEALTHCARE_FACILITY
      if (session.role === 'HEALTHCARE_FACILITY') {
        includeData.healthcareFacility = true;
      }

      // Fetch the user profile
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: includeData,
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
      // Step 1: Update basic user fields
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          location,
          phone,
        },
      });

      // Step 2: If the user is a TELECONSULTER, update teleconsultor-related data
      if (session.role === 'TELECONSULTER') {
        // Ensure `rate` is passed as a float and not a string
        const parsedRate = rate ? parseFloat(rate) : undefined;

        await prisma.teleconsultor.update({
          where: { userId },
          data: {
            rate: parsedRate,  // Make sure the rate is passed as a number
            doctorInfo,
            specialties,
            workingHours,
          },
        });
      }

      // Step 3: If the user is a HEALTHCARE_FACILITY, update healthcare facility-related data
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
