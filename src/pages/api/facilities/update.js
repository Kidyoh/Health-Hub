import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  // Check if the user is authenticated and is a healthcare facility with APPROVED status
  if (
    !session ||
    session.role !== 'HEALTHCARE_FACILITY' ||
    session.status !== 'APPROVED'
  ) {
    return res.status(403).json({ error: 'Unauthorized or not approved.' });
  }

  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { name, location, services, hours, contact, type } = req.body;

  // Only allow updating certain fields, e.g., location, services, hours, contact, type
  const updateData = {};
  if (name) updateData.name = name;
  if (location) updateData.location = location;
  if (services) updateData.services = services;
  if (hours) updateData.hours = hours;
  if (contact) updateData.contact = contact;
  if (type) updateData.type = type;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { healthcareFacility: true },
    });

    if (!user.healthcareFacility) {
      return res.status(400).json({ error: 'Healthcare facility not found.' });
    }

    const updatedFacility = await prisma.healthcareFacility.update({
      where: { id: user.healthcareFacility.id },
      data: updateData,
    });

    return res.status(200).json({ success: true, updatedFacility });
  } catch (error) {
    console.error('Error updating facility:', error);
    return res.status(500).json({ error: 'Failed to update healthcare facility.' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
