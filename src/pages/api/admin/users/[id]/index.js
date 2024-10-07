import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { firstName, lastName, email, phone, role, password, status } = req.body;

    console.log('Received request to update user:', { id, firstName, lastName, email, phone, role, password, status });

    try {
      // Validate status if provided
      if (status && !['PENDING', 'APPROVED'].includes(status)) {
        console.log('Invalid status:', status);
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }

      // Validate role if provided
      if (role && !['USER', 'TELECONSULTER', 'ADMIN', 'HEALTHCARE_FACILITY'].includes(role)) {
        console.log('Invalid role:', role);
        return res.status(400).json({ success: false, message: 'Invalid role' });
      }

      // Update the user data in Prisma, including status if provided
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id, 10) },
        data: {
          firstName,
          lastName,
          email,
          phone,
          role,
          password,
          status, // Include status update here
        },
      });

      console.log('Updated user:', updatedUser);

      res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ success: false, message: 'Failed to update user', error: error.message });
    }
  } else {
    console.log('Invalid request method:', req.method);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
