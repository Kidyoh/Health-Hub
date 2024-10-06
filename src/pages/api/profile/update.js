import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
    const {
      firstName, lastName, email, password, location, phone, specialties, rate, doctorInfo, workingHours, healthcareDetails,
    } = req.body;

    try {
      // Step 1: Validate email, phone, etc. based on role and incoming data
      const updateData = {
        firstName,
        lastName,
        email,
        location,
        phone,
      };

      if (password) {
        updateData.password = password;  // Ensure to hash the password properly
      }

      // Step 2: Update based on Role (TELECONSULTER, HEALTHCARE_FACILITY)
      if (session.role === 'TELECONSULTER') {
        const teleconsultorUpdateData = {
          rate,
          specialties,
          doctorInfo,
          workingHours,
        };

        await prisma.teleconsultor.update({
          where: { userId: session.id },
          data: teleconsultorUpdateData,
        });
      }

      if (session.role === 'HEALTHCARE_FACILITY') {
        const healthcareUpdateData = {
          services: healthcareDetails.services,
          location: healthcareDetails.location,
          hours: healthcareDetails.hours,
          contact: healthcareDetails.contact,
          type: healthcareDetails.type,
        };

        await prisma.healthcareFacility.update({
          where: { userId: session.id },
          data: healthcareUpdateData,
        });
      }

      // Step 3: Update basic user data
      const updatedUser = await prisma.user.update({
        where: { id: session.id },
        data: updateData,
      });

      return res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update profile.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed.' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
});
