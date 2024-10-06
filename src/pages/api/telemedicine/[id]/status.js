import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');
  const { id } = req.query;

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Pending', 'In Progress', 'Completed', 'Canceled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    try {
      const consultation = await prisma.teleconsultation.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!consultation) {
        return res.status(404).json({ error: 'Consultation not found.' });
      }

      if (consultation.userId !== session.id && session.role !== 'ADMIN') {
        return res.status(403).json({ error: 'You are not authorized to update this consultation.' });
      }

      const updatedConsultation = await prisma.teleconsultation.update({
        where: { id: parseInt(id, 10) },
        data: { status },
      });

      return res.status(200).json({ success: true, updatedConsultation });
    } catch (error) {
      console.error('Error updating status:', error);
      return res.status(500).json({ error: 'Failed to update consultation status.' });
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
