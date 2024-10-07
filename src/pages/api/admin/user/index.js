import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;

    try {
      if (id) {
        // If id is provided in the query, fetch the specific user
        const user = await prisma.user.findUnique({
          where: { id: parseInt(id, 10) },
        });

        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user });
      } else {
        // If no id is provided, fetch all users
        const users = await prisma.user.findMany();
        res.status(200).json({ success: true, users });
      }
    } catch (error) {
      console.error('Error fetching user(s):', error);
      res.status(500).json({ success: false, message: 'Failed to fetch user(s)' });
    }
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    const { firstName, lastName, email, phone, role, password } = req.body;

    try {
      // Update the user data in Prisma
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id, 10) },
        data: { firstName, lastName, email, phone, role, password },
      });

      res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ success: false, message: 'Failed to update user' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
