import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      console.log('Fetching completed appointments for user:', session.id);

      // Fetch only completed appointments for the user (assuming 'Completed' or 'Approved' as completed status)
      const appointments = await prisma.appointment.findMany({
        where: {
          userId: session.id,
          status: 'Completed', // Adjust the status value based on your schema (e.g., 'Approved' or 'Completed')
        },
        include: {
          teleconsultation: true, 
          prescription: true, // Include prescription if needed
        },
      });

      console.log('Fetched completed appointments:', appointments);

      // Separate telemedicine and facility-based appointments
      const telemedicineAppointments = appointments.filter(appointment => appointment.teleconsultationId);
      const facilityAppointments = appointments.filter(appointment => appointment.facilityId);

      console.log('Telemedicine appointments:', telemedicineAppointments);
      console.log('Facility appointments:', facilityAppointments);

      return res.status(200).json({
        success: true,
        telemedicineAppointments,
        facilityAppointments,
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return res.status(500).json({ error: 'Failed to retrieve appointments.' });
    } finally {
      await prisma.$disconnect(); // Ensure the Prisma Client connection is closed
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
