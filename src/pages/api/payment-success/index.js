import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const { teleconsultationId } = req.body;

  if (!teleconsultationId) {
    return res.status(400).json({ error: 'Teleconsultation ID is required.' });
  }

  try {
    // Find the teleconsultation details
    const teleconsultation = await prisma.teleconsultation.findUnique({
      where: { id: parseInt(teleconsultationId) },
      include: {
        user: true, // Get the user associated with the teleconsultation
      },
    });

    if (!teleconsultation) {
      return res.status(404).json({ error: 'Teleconsultation not found.' });
    }

    // If the teleconsultation is already approved, skip further updates
    if (teleconsultation.status === 'Approved') {
      return res.status(200).json({ success: true, message: 'Teleconsultation is already approved.' });
    }

    // Update teleconsultation status to Approved
    await prisma.teleconsultation.update({
      where: { id: parseInt(teleconsultationId) },
      data: { status: 'Approved' },
    });

    // Send a notification to the user that their teleconsultation has been approved
    await prisma.notification.create({
      data: {
        userId: teleconsultation.userId,
        type: 'SessionApproved', // Ensure type is valid
        content: `Your teleconsultation with Dr. ${teleconsultation.doctor} has been approved and is ready.`,
        date: new Date(),
      },
    });
    

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating teleconsultation status:', error);
    return res.status(500).json({ error: 'Failed to update teleconsultation status.' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
