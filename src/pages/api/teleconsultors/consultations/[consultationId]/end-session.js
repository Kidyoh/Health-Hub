import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');
  const { consultationId } = req.query;
  const { notes, medicines, dosage } = req.body;

  console.log("Session data:", session);
  console.log("Consultation ID:", consultationId);
  console.log("Received data: Notes:", notes, "Medicines:", medicines, "Dosage:", dosage);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      // Fetch the consultation based on the consultationId
      const consultation = await prisma.teleconsultation.findUnique({
        where: { id: parseInt(consultationId, 10) },
      });

      if (!consultation) {
        return res.status(404).json({ error: 'Consultation not found' });
      }

      if (consultation.status === 'Completed') {
        return res.status(400).json({ error: 'Consultation already completed' });
      }

      // If a session URL exists, delete the Daily.co room
      if (consultation.sessionUrl) {
        const roomName = consultation.sessionUrl.split('/').pop();
        await axios.delete(`https://api.daily.co/v1/rooms/${roomName}`, {
          headers: { Authorization: `Bearer ${process.env.DAILY_API_KEY}` },
        });
      }

      // Update the consultation status and notes
      await prisma.teleconsultation.update({
        where: { id: parseInt(consultationId, 10) },
        data: { status: 'Completed', sessionUrl: null, notes },
      });

      // Update or create a prescription record for the consultation
      await prisma.prescription.create({
        data: {
          userId: consultation.userId,
          doctor: consultation.doctor,
          medicines: medicines,
          dosage: dosage,
          teleconsultationId: consultation.id,  // Link the prescription to the consultation
        },
      });

      console.log('Consultation ended and prescription saved for ID:', consultationId);
      return res.status(200).json({ success: true, message: 'Session ended and prescription saved.' });
    } catch (error) {
      console.error('Error ending session:', error);
      return res.status(500).json({ error: 'Failed to end session or save prescription.' });
    } finally {
      await prisma.$disconnect();
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
