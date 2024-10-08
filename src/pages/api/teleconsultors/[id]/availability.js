import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const availability = await prisma.availability.findMany({
      where: { teleconsultorId: parseInt(id) },
      orderBy: { dayOfWeek: 'asc' },
    });

    res.status(200).json({ success: true, availability });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Error fetching availability' });
  }
}
