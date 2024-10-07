import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  // Check if the user is authorized (must be admin)
  if (!session || session.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
    const { id } = req.query; // Teleconsultor ID from the query string
    const { specialties, rate, workingHours, status } = req.body; // Updated data from the request body

    try {
      // Check if the teleconsultor exists
      const teleconsultor = await prisma.teleconsultor.findUnique({
        where: { id: Number(id) },
        include: { user: true },
      });

      if (!teleconsultor) {
        return res.status(404).json({ error: 'Teleconsultor not found' });
      }

      // Update the teleconsultor details
      const updatedTeleconsultor = await prisma.teleconsultor.update({
        where: { id: Number(id) },
        data: {
          specialties,
          rate: Number(rate),
          workingHours,
          status,
        },
      });

      res.status(200).json({ success: true, teleconsultor: updatedTeleconsultor });
    } catch (error) {
      console.error("Error updating teleconsultor:", error);
      res.status(500).json({ error: 'Failed to update teleconsultor' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
