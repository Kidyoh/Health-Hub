// /api/telemedicine/[id]/feedback.ts
import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');
  const { id } = req.query; // teleconsultationId
  const { rating, feedback } = req.body;

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      // Step 1: Find the teleconsultation and include the teleconsultor user data
      const teleconsultation = await prisma.teleconsultation.findUnique({
        where: { id: parseInt(id, 10) },
        include: { teleconsultor: { include: { user: true } } }, // Include teleconsultor and their user data
      });

      if (!teleconsultation) {
        return res.status(404).json({ error: 'Teleconsultation not found.' });
      }

      const teleconsultor = teleconsultation.teleconsultor;

      if (!teleconsultor) {
        return res.status(404).json({ error: 'Teleconsultor not found.' });
      }

      // Step 2: Create the feedback and associate it with the teleconsultation's ID
      const newFeedback = await prisma.feedback.create({
        data: {
          userId: session.id, // User who gave the feedback
          teleconsultationId: teleconsultation.id, // Relate feedback to the teleconsultation
          content: feedback,
          rating,
        },
      });

      // Step 3: Calculate the new average rating for the teleconsultor
      const avgRating = await prisma.feedback.aggregate({
        where: { teleconsultationId: teleconsultation.id }, // Aggregate ratings for the teleconsultation
        _avg: { rating: true },
      });

      // Step 4: Update the teleconsultor's rating in the Teleconsultor model
      await prisma.teleconsultor.update({
        where: { id: teleconsultor.id },
        data: { rating: avgRating._avg.rating }, 
      });

      return res.status(200).json({ success: true, message: 'Feedback submitted and teleconsultor rating updated.' });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return res.status(500).json({ error: 'Failed to submit feedback.' });
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