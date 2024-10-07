import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Fetch all facilities
    try {
      const facilities = await prisma.healthcareFacility.findMany();
      res.status(200).json({ success: true, facilities });
    } catch (error) {
      console.error('Error fetching facilities:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch facilities' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
