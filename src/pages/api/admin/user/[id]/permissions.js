// /api/admin/users/[id]/permissions.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id, 10) },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  } else if (req.method === 'PUT') {
    // Handle updating user role
    const { role } = req.body;
    
    if (!role || !['USER', 'TELECONSULTER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id, 10) },
        data: { role },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user role' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
