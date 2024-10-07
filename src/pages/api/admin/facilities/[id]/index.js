import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Fetch specific facility by id
    try {
      const facility = await prisma.healthcareFacility.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!facility) {
        return res.status(404).json({ success: false, message: 'Facility not found' });
      }

      res.status(200).json({ success: true, facility });
    } catch (error) {
      console.error('Error fetching facility:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch facility' });
    }
  } else if (req.method === 'PUT') {
    // Update specific facility by id
    const { name, location, services, contact, type, appointmentPrice } = req.body;

    try {
      // Ensure appointmentPrice is parsed as a float
      const updatedFacility = await prisma.healthcareFacility.update({
        where: { id: parseInt(id, 10) },
        data: {
          name,
          location,
          services,
          contact,
          type,
          appointmentPrice: parseFloat(appointmentPrice), // Parse the string to a float
        },
      });

      res.status(200).json({ success: true, facility: updatedFacility });
    } catch (error) {
      console.error('Error updating facility:', error);
      res.status(500).json({ success: false, message: 'Failed to update facility' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
