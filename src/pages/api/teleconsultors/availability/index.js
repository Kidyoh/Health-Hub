import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  // Log the session data for debugging
  console.log("Session Data:", session);

  // Check if the session contains a valid user with the role TELECONSULTER
  if (!session || session.role !== 'TELECONSULTER') {
    return res.status(403).json({ error: 'Unauthorized or invalid session' });
  }

  // Fetch the teleconsultor using the userId from the session
  try {
    const teleconsultor = await prisma.teleconsultor.findUnique({
      where: { userId: session.id },
    });

    // If the teleconsultor doesn't exist, return an error
    if (!teleconsultor) {
      return res.status(403).json({ error: 'Teleconsultor not found for this user' });
    }

    // Log the teleconsultor data for debugging
    console.log("Teleconsultor Data:", teleconsultor);

    const teleconsultorId = teleconsultor.id; // Use teleconsultorId for the requests

    // Handle POST request (create availability)
    if (req.method === 'POST') {
      const { dayOfWeek, startTime, endTime } = req.body;

      try {
        const availability = await prisma.availability.create({
          data: {
            teleconsultorId,
            dayOfWeek,
            startTime,
            endTime,
          },
        });

        console.log("Created Availability:", availability);
        return res.status(200).json({ success: true, availability });
      } catch (error) {
        console.error('Error creating availability:', error);
        return res.status(500).json({ error: 'Error creating availability' });
      }
    }

    // Handle PUT request (update availability)
    if (req.method === 'PUT') {
      const { id, dayOfWeek, startTime, endTime } = req.body;

      try {
        const availability = await prisma.availability.update({
          where: { id },
          data: {
            dayOfWeek,
            startTime,
            endTime,
          },
        });

        console.log("Updated Availability:", availability);
        return res.status(200).json({ success: true, availability });
      } catch (error) {
        console.error('Error updating availability:', error);
        return res.status(500).json({ error: 'Error updating availability' });
      }
    }

    // Handle GET request (fetch availability)
    if (req.method === 'GET') {
      try {
        const availability = await prisma.availability.findMany({
          where: {
            teleconsultorId,
          },
          orderBy: {
            dayOfWeek: 'asc',
          },
        });

        console.log("Fetched Availability:", availability);
        return res.status(200).json({ success: true, availability });
      } catch (error) {
        console.error('Error fetching availability:', error);
        return res.status(500).json({ error: 'Error fetching availability' });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error fetching teleconsultor data:', error);
    return res.status(500).json({ error: 'Error fetching teleconsultor data' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
});
