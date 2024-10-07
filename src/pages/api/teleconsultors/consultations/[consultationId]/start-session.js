// /pages/api/teleconsultor/consultations/[consultationId]/start-session.ts
import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');
  const { consultationId } = req.query;

  // Log the session and consultation ID to ensure correct data is passed
  console.log("Session data:", session);
  console.log("Consultation ID from query:", consultationId);

  if (!session || session.role !== 'TELECONSULTER') {
    console.log("Unauthorized access attempt. Session:", session);
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    // Fetch the consultation from the database
    const consultation = await prisma.teleconsultation.findUnique({
      where: { id: parseInt(consultationId, 10) },
    });

    console.log("Fetched consultation data:", consultation);

    // If consultation doesn't exist, log and return
    if (!consultation) {
      console.log("Consultation not found with ID:", consultationId);
      return res.status(404).json({ error: 'Consultation not found' });
    }

    // If session URL already exists, return it
    if (consultation.sessionUrl) {
      console.log("Session already exists, URL:", consultation.sessionUrl);
      return res.status(200).json({ success: true, roomUrl: consultation.sessionUrl });
    }

    // Create a new session using Daily.co API
    console.log("Creating a new Daily.co session...");
    const roomResponse = await axios.post(
      'https://api.daily.co/v1/rooms',
      {
        properties: {
          enable_chat: true,
          enable_screenshare: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
        },
      }
    );

    console.log("Daily.co API response:", roomResponse.data);

    const roomUrl = roomResponse.data.url;

    // Update the consultation with the new session URL and status
    const updatedConsultation = await prisma.teleconsultation.update({
      where: { id: parseInt(consultationId, 10) },
      data: {
        sessionUrl: roomUrl,
        status: 'In Progress',
        paymentStatus: 'Approved', // Ensure payment status is approved before starting
      },
    });

    console.log("Updated consultation with session URL:", updatedConsultation);

    // Return the newly created room URL
    return res.status(200).json({ success: true, roomUrl });
  } catch (error) {
    console.error("Error starting session:", error); // Log any errors that occur
    return res.status(500).json({ error: 'Failed to start consultation session.' });
  } finally {
    await prisma.$disconnect();
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
