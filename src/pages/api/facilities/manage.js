import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { method } = req;

  switch (method) {
    case 'POST': {
      // Admin creates a new healthcare facility
      if (session.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Only admins can create facilities.' });
      }

      const { name, location, services, hours, contact, type } = req.body;

      if (!name || !location || !services || !contact || !type) {
        return res.status(400).json({ error: 'All fields are required.' });
      }

      try {
        const facility = await prisma.healthcareFacility.create({
          data: { name, location, services, hours, contact, type },
        });
        return res.status(201).json({ success: true, facility });
      } catch (error) {
        console.error('Error creating facility:', error);
        return res.status(500).json({ error: 'Failed to create facility.' });
      }
    }

    case 'PUT': {
      // Admin updates any facility or Healthcare Facility updates their own facility
      const { id, name, location, services, hours, contact, type } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Facility ID is required for updating.' });
      }

      try {
        let facility;

        if (session.role === 'ADMIN') {
          // Admin can update any facility
          facility = await prisma.healthcareFacility.update({
            where: { id: parseInt(id, 10) },
            data: { name, location, services, hours, contact, type },
          });
        } else if (session.role === 'HEALTHCARE_FACILITY') {
          // Healthcare Facility can update their own facility
          const user = await prisma.user.findUnique({
            where: { id: session.id },
            include: { healthcareFacility: true },
          });

          if (!user.healthcareFacility || user.healthcareFacility.id !== parseInt(id, 10)) {
            return res.status(403).json({ error: 'You can only update your own facility.' });
          }

          facility = await prisma.healthcareFacility.update({
            where: { id: parseInt(id, 10) },
            data: { location, services, hours, contact, type }, // Perhaps limit fields they can update
          });
        } else {
          return res.status(403).json({ error: 'Unauthorized to update facility.' });
        }

        return res.status(200).json({ success: true, facility });
      } catch (error) {
        console.error('Error updating facility:', error);
        return res.status(500).json({ error: 'Failed to update facility.' });
      }
    }

    case 'DELETE': {
      // Only admins can delete facilities
      if (session.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Only admins can delete facilities.' });
      }

      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Facility ID is required for deletion.' });
      }

      try {
        await prisma.healthcareFacility.delete({
          where: { id: parseInt(id, 10) },
        });
        return res.status(200).json({ success: true, message: 'Facility deleted successfully.' });
      } catch (error) {
        console.error('Error deleting facility:', error);
        return res.status(500).json({ error: 'Failed to delete facility.' });
      }
    }

    default:
      res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
