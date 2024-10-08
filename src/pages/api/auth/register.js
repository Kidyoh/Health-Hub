import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      firstName,
      lastName,
      email,
      password,
      location: userLocation, // User's personal location
      phone,
      name, // Facility name for Healthcare Facility
      location: facilityLocation, // Facility-specific location
      services,
      openHours, // Facility opening hours
      closeHours, // Facility closing hours
      contact, // Facility-specific contact number
      type, // Facility type
      specialties, // Teleconsultor specific fields
      rate,
      workingHours,
      role,
    } = req.body;

    console.log("Received Fields:", { firstName, lastName, email, password, role });

    try {
      // Check if email is already registered
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Step 1: Create the user
      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          location: userLocation,
          phone,
          role,
        },
      });

      // Step 2: Check the role and create associated data
      if (role === 'HEALTHCARE_FACILITY') {
        const facility = await prisma.healthcareFacility.create({
          data: {
            name,
            location: facilityLocation,
            services,
            hours: `${openHours} - ${closeHours}`,
            contact,
            type,
            user: {
              connect: { id: newUser.id },
            },
          },
        });

        // Update user with healthcare facility ID
        await prisma.user.update({
          where: { id: newUser.id },
          data: { healthcareFacilityId: facility.id },
        });
      }

      if (role === 'TELECONSULTER') {
        const teleconsultor = await prisma.teleconsultor.create({
          data: {
            user: {
              connect: { id: newUser.id },
            },
            specialties,
            rate: parseFloat(rate), // Make sure rate is stored as a float
            workingHours,
          },
        });

        // No need to update user in this case as teleconsultor info is separate
      }

      // Respond with success
      res.status(201).json({ success: true, data: { user: newUser } });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'User registration failed.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }

  prisma.$disconnect();
}
