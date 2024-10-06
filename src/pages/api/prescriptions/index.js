// /api/prescriptions/index.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query; // Get the user ID from query parameters

    try {
      const prescriptions = await prisma.prescription.findMany({
        where: { userId: parseInt(userId) },
        orderBy: {
          createdAt: 'desc', // Sort by creation date
        },
        select: {
          id: true,
          doctor: true,
          medicines: true,
          dosage: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!prescriptions || prescriptions.length === 0) {
        return res.status(404).json({ error: 'No prescriptions found for this user' });
      }

      res.status(200).json(prescriptions);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      res.status(500).json({ error: 'Error fetching prescriptions' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
