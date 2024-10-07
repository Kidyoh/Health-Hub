import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
  console.log('Request received:', req.method, req.url);
  
  const session = req.session.get('user');
  console.log('Session:', session);

  if (!session) {
    console.log('Unauthorized access attempt');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.id;
  console.log('User ID:', userId);

  if (req.method === 'GET') {
    try {
      const includeData = {
        appointments: true,
        teleconsultations: true,
        notifications: true,
        feedback: true,
        prescriptions: true,
      };

      // Fetch user profile and teleconsultor if applicable
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          ...includeData,
          // Fetch teleconsultor data only if the user has the TELECONSULTER role
          Teleconsultor: session.role === 'TELECONSULTER' ? true : false,
        },
      });
      console.log('Fetched user:', user);

      if (!user) {
        console.log('User not found for ID:', userId);
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
      rate,         // Teleconsultor-specific fields
      doctorInfo,   // Teleconsultor-specific fields
      specialties,  // Teleconsultor-specific fields
      workingHours, // Teleconsultor-specific fields
      services,
      hours,
      contact,
      type,
    } = req.body;
    console.log('Request body:', req.body);

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
      console.log('Updated user:', updatedUser);

      // Step 2: If the user is a TELECONSULTER, update teleconsultor-related data
      if (session.role === 'TELECONSULTER') {
        const parsedRate = rate ? parseFloat(rate) : undefined; // Ensure rate is a float

        const updatedTeleconsultor = await prisma.teleconsultor.upsert({
          where: { userId }, // Match by userId
          update: {
            rate: parsedRate,
            doctorInfo,
            specialties,
            workingHours,
          },
          create: {
            userId,
            rate: parsedRate,
            doctorInfo,
            specialties,
            workingHours,
          },
        });
        console.log('Updated teleconsultor:', updatedTeleconsultor);
      }

      // Step 3: If the user is a HEALTHCARE_FACILITY, update healthcare facility-related data
      if (session.role === 'HEALTHCARE_FACILITY') {
        const updatedHealthcareFacility = await prisma.healthcareFacility.update({
          where: { userId },
          data: {
            services,
            location,
            hours,
            contact,
            type,
          },
        });
        console.log('Updated healthcare facility:', updatedHealthcareFacility);
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