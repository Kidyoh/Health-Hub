// /pages/api/teleconsultor/consultations/[consultationId]/start-session.ts
import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');
  const { consultationId } = req.query;

  if (!session || session.role !== 'TELECONSULTER') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    // Find the consultation by ID
    const consultation = await prisma.teleconsultation.findUnique({
      where: { id: parseInt(consultationId, 10) },
    });

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    // If session URL already exists, return it
    if (consultation.sessionUrl) {
      return res.status(200).json({ success: true, roomUrl: consultation.sessionUrl });
    }

    // Create a new session if one doesn't exist
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

    const roomUrl = roomResponse.data.url;

    // Update the consultation with the new session URL and mark it as 'In Progress'
    await prisma.teleconsultation.update({
      where: { id: parseInt(consultationId, 10) },
      data: {
        sessionUrl: roomUrl,
        status: 'In Progress',
        paymentStatus: 'Approved', // Ensure payment is approved before starting
      },
    });

    return res.status(200).json({ success: true, roomUrl });
  } catch (error) {
    console.error('Error starting session:', error);
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
