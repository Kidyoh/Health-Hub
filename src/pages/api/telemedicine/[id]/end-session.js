import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');
  const { id } = req.query;
  const { notes, medicines, dosage } = req.body; // Accept prescription details from TELECONSULTER

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const consultation = await prisma.teleconsultation.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!consultation || consultation.userId !== session.id) {
        return res.status(404).json({ error: 'Consultation not found or you are not authorized.' });
      }

      if (consultation.status === 'Completed') {
        return res.status(400).json({ error: 'Consultation already completed.' });
      }

      // Delete the Daily.co room if it exists
      if (consultation.sessionUrl) {
        const roomName = consultation.sessionUrl.split('/').pop();
        await axios.delete(`https://api.daily.co/v1/rooms/${roomName}`, {
          headers: { Authorization: `Bearer ${process.env.DAILY_API_KEY}` },
        });
      }

      // Update the consultation with prescription, dosage, and notes
      await prisma.teleconsultation.update({
        where: { id: parseInt(id, 10) },
        data: {
          status: 'Completed',
          sessionUrl: null,
          notes,
          prescription: {
            create: {
              userId: consultation.userId, // Link to the user
              doctor: consultation.doctor, // Doctor's name from consultation
              medicines, // Prescribed medicines
              dosage,   // Dosage details
            }
          }
        },
      });

      // Also update the related appointment status to 'Completed'
      await prisma.appointment.updateMany({
        where: { teleconsultationId: consultation.id },
        data: { status: 'Completed' },
      });

      return res.status(200).json({ success: true, message: 'Session ended, prescription saved, and appointment updated.' });
    } catch (error) {
      console.error('Error ending session and updating appointment:', error);
      return res.status(500).json({ error: 'Failed to end session, save prescription, and update appointment.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
});
