import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session || session.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { method } = req;

  switch (method) {
    case 'POST': {
      // Creating a new medical information entry
      const { title, content, keywords, category, author } = req.body;

      try {
        const medicalInfo = await prisma.medicalInformation.create({
          data: {
            title,
            content,
            keywords,
            category,
            author,
          },
        });
        return res.status(201).json({ success: true, medicalInfo });
      } catch (error) {
        console.error('Error creating medical info:', error);
        return res.status(500).json({ error: 'Failed to create medical info.' });
      }
    }

    case 'PUT': {
      // Updating an existing medical information entry
      const { id, title, content, keywords, category, author } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID is required for updating medical info.' });
      }

      try {
        const updatedMedicalInfo = await prisma.medicalInformation.update({
          where: { id: parseInt(id) },
          data: {
            title,
            content,
            keywords,
            category,
            author,
          },
        });
        return res.status(200).json({ success: true, updatedMedicalInfo });
      } catch (error) {
        console.error('Error updating medical info:', error);
        return res.status(500).json({ error: 'Failed to update medical info.' });
      }
    }

    case 'DELETE': {
      // Deleting a medical information entry
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID is required for deleting medical info.' });
      }

      try {
        await prisma.medicalInformation.delete({
          where: { id: parseInt(id) },
        });
        return res.status(200).json({ success: true, message: 'Medical info deleted successfully' });
      } catch (error) {
        console.error('Error deleting medical info:', error);
        return res.status(500).json({ error: 'Failed to delete medical info.' });
      }
    }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
