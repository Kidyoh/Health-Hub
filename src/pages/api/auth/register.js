import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, firstName, lastName, role, healthcareFacilityData } = req.body;

    // Prevent users from registering as admin
    if (role === 'ADMIN') {
      return res.status(403).json({ error: 'Admin role is restricted.' });
    }

    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Set status based on role
    const status = (role === 'TELECONSULTER' || role === 'HEALTHCARE_FACILITY') ? 'PENDING' : 'APPROVED';

    try {
      // Start a transaction
      const user = await prisma.$transaction(async (prisma) => {
        // Create the user
        const newUser = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role,
            status,
          },
        });

        // If the user is a healthcare facility, create the facility
        if (role === 'HEALTHCARE_FACILITY' && healthcareFacilityData) {
          await prisma.healthcareFacility.create({
            data: {
              name: healthcareFacilityData.name,
              location: healthcareFacilityData.location,
              services: healthcareFacilityData.services,
              hours: healthcareFacilityData.hours,
              contact: healthcareFacilityData.contact,
              type: healthcareFacilityData.type,
              userId: newUser.id, // Link to the user
            },
          });
        }

        return newUser;
      });

      res.status(201).json({ success: true, user });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'User registration failed.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
