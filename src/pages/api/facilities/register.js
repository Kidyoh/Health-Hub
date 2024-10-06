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
      name, // Facility name
      location: facilityLocation, // Facility-specific location
      services,
      openHours, // Facility opening hours
      closeHours, // Facility closing hours
      contact, // Facility-specific contact number
      type,
    } = req.body;

    // Log the received data for debugging
    console.log("Received Fields:", { firstName, lastName, email, password, name, facilityLocation, services, openHours, closeHours, contact, type });

    // Check if all required fields are provided
    if (!firstName || !lastName || !email || !password || !name || !facilityLocation || !services || !openHours || !closeHours || !contact || !type) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // Check if the email is already registered
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
          location: userLocation, // User's personal location
          phone, // User's personal phone number
          role: 'HEALTHCARE_FACILITY', // Assign the user as a healthcare facility
        },
      });

      // Step 2: Create the healthcare facility and link to the user
      const facility = await prisma.healthcareFacility.create({
        data: {
          name,
          location: facilityLocation, // Facility-specific location
          services,
          hours: `${openHours} - ${closeHours}`, // Combine open and close hours
          contact, // Facility-specific contact number
          type,
          user: {
            connect: { id: newUser.id }, // Link the facility to the created user
          },
        },
      });

      // Step 3: Update the user with the `healthcareFacilityId`
      await prisma.user.update({
        where: { id: newUser.id },
        data: { healthcareFacilityId: facility.id },
      });

      // Respond with success
      res.status(201).json({ success: true, data: { user: newUser, facility } });
    } catch (error) {
      console.error('Error registering user or facility:', error);
      res.status(500).json({ error: 'An error occurred while creating the user or facility' });
    }
  } else {
    // If the request is not a POST, respond with an error
    res.status(405).json({ error: 'Method not allowed' });
  }

  prisma.$disconnect();
}
