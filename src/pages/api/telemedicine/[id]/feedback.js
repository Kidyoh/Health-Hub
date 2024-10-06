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
      // Step 1: Find the teleconsultation to get the doctor name
      const teleconsultation = await prisma.teleconsultation.findUnique({
        where: { id: parseInt(id, 10) },
        include: { user: true }, // Ensure we're including related data like the teleconsultor
      });

      if (!teleconsultation) {
        return res.status(404).json({ error: 'Teleconsultation not found.' });
      }

      // Step 2: Lookup the teleconsultor's ID based on the userId (as the teleconsultor's data is linked to the user)
      const teleconsultor = await prisma.teleconsultor.findUnique({
        where: { userId: teleconsultation.userId }, // Match by the userId of the teleconsultation
      });

      if (!teleconsultor) {
        return res.status(404).json({ error: 'Teleconsultor not found.' });
      }

      // Step 3: Create the feedback and associate it with the teleconsultor's ID
      const newFeedback = await prisma.feedback.create({
        data: {
          userId: session.id, // User who gave the feedback
          teleconsultationId: teleconsultation.id, // Relate feedback to the teleconsultation
          content: feedback,
          rating,
        },
      });

      // Step 4: Calculate the new average rating for the teleconsultor
      const avgRating = await prisma.feedback.aggregate({
        where: { teleconsultationId: teleconsultation.id },
        _avg: { rating: true },
      });

      // Step 5: Update the teleconsultor's rating in the Teleconsultor model
      await prisma.teleconsultor.update({
        where: { userId: teleconsultor.userId },
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
