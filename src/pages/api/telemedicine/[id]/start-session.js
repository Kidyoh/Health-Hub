import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');
  const { id } = req.query;  // Correctly destructuring the ID from the request query

  // Log the session to verify authentication
  console.log("Session Data:", session);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      // Find the consultation based on the ID
      const consultation = await prisma.teleconsultation.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!consultation || consultation.userId !== session.id) {
        return res.status(404).json({ error: 'Consultation not found or you are not authorized.' });
      }

      // If room already exists, return it
      if (consultation.sessionUrl) {
        return res.status(200).json({ success: true, roomUrl: consultation.sessionUrl });
      }

      // Create a Daily.co room if it doesn't exist
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

      // Update the consultation with the new room URL and payment status
      const updatedConsultation = await prisma.teleconsultation.update({
        where: { id: parseInt(id, 10) },
        data: { 
          sessionUrl: roomUrl, 
          status: 'In Progress',
          paymentStatus: 'Approved' // Update payment status to 'Approved'
        },
      });

      return res.status(200).json({ success: true, roomUrl });
    } catch (error) {
      console.error('Error starting session:', error);
      return res.status(500).json({ error: 'Failed to start consultation session.' });
    } finally {
      await prisma.$disconnect(); // Ensure Prisma connection is closed
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
