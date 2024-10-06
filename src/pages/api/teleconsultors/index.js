import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch all teleconsultors with their names, rates, and ratings
      const teleconsultors = await prisma.user.findMany({
        where: {
          role: 'TELECONSULTER',
          status: 'APPROVED',
        },
        select: {
          firstName: true,
          lastName: true,
          teleconsultor: {
            select: {
              id: true,
              rate: true,
              rating: true,
            },
          },
        },
      });

      return res.status(200).json({ success: true, teleconsultors });
    } catch (error) {
      console.error('Error fetching teleconsultors:', error);
      return res.status(500).json({ error: 'Failed to fetch teleconsultors' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

export default handler;