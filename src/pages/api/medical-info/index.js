import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method, query: { id } } = req;

  switch (method) {
    case 'GET': {
      if (id) {
        // Fetch specific medical info by ID
        try {
          const medicalInfo = await prisma.medicalInformation.findUnique({
            where: { id: parseInt(id) },
          });
          return res.status(200).json({ success: true, medicalInfo });
        } catch (error) {
          console.error('Error fetching medical info:', error);
          return res.status(500).json({ error: 'Failed to fetch medical info.' });
        }
      } else {
        // Fetch all medical info
        try {
          const medicalInfoList = await prisma.medicalInformation.findMany();
          return res.status(200).json({ success: true, medicalInfoList });
        } catch (error) {
          console.error('Error fetching medical info:', error);
          return res.status(500).json({ error: 'Failed to fetch medical info.' });
        }
      }
    }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
