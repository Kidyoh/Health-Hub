import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  console.log('Request received:', req.method, req.url);
  
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { teleconsultorId, requestedDate } = req.body;
  console.log('Request body:', req.body);

  if (!teleconsultorId || !requestedDate) {
    console.log('Missing teleconsultorId or requestedDate');
    return res.status(400).json({ error: 'Teleconsultor ID and requested date are required.' });
  }

  try {
    // Step 1: Parse the requested date and time
    const parsedRequestedDate = new Date(requestedDate);
    const requestedDayOfWeek = parsedRequestedDate.toLocaleString('en-US', { weekday: 'long' }).toLowerCase(); // Convert to lowercase
    const requestedTime = parsedRequestedDate.toTimeString().slice(0, 5);  // Format time as HH:mm
    console.log('Parsed requested date:', parsedRequestedDate);
    console.log('Requested day of week:', requestedDayOfWeek);
    console.log('Requested time (HH:mm):', requestedTime);

    // Step 2: Check if there is an existing teleconsultation at the same time
    const existingConsultation = await prisma.teleconsultation.findFirst({
      where: {
        teleconsultorId: parseInt(teleconsultorId, 10),
        date: parsedRequestedDate,
      },
    });
    console.log('Existing consultation:', existingConsultation);

    if (existingConsultation) {
      console.log('Consultation already exists for this date and teleconsultor');
      return res.status(400).json({ error: 'A consultation already exists for this date and teleconsultor.' });
    }

    // Step 3: Fetch all availability for the teleconsultor
    const availabilityList = await prisma.availability.findMany({
      where: {
        teleconsultorId: parseInt(teleconsultorId, 10),
      },
    });
    console.log('Availability list:', availabilityList);

    // Step 4: Check availability for the requested day of the week (case-insensitive)
    const matchingAvailability = availabilityList.find((availability) =>
      availability.dayOfWeek.toLowerCase() === requestedDayOfWeek
    );
    console.log('Matching availability:', matchingAvailability);

    if (!matchingAvailability) {
      console.log('Teleconsultor does not have any availability set for this day');
      return res.status(400).json({ error: 'Teleconsultor does not have any availability for this day.' });
    }

    // Step 5: Check if the requested time falls within the available time range
    const [startHour, startMinute] = matchingAvailability.startTime.split(':').map(Number);
    const [endHour, endMinute] = matchingAvailability.endTime.split(':').map(Number);
    const [requestedHour, requestedMinute] = requestedTime.split(':').map(Number);

    const isWithinAvailability = (
      (requestedHour > startHour || (requestedHour === startHour && requestedMinute >= startMinute)) &&
      (requestedHour < endHour || (requestedHour === endHour && requestedMinute <= endMinute))
    );

    if (!isWithinAvailability) {
      console.log('Teleconsultor is not available at the requested time');
      return res.status(400).json({ error: 'Teleconsultor is not available at the requested time.' });
    }

    // Step 6: If all checks pass, allow the user to proceed to the payment gateway
    console.log('Teleconsultor is available for the requested time');
    return res.status(200).json({ success: true, message: 'Teleconsultor is available for the requested time.' });
  } catch (error) {
    console.error('Error checking availability:', error);
    return res.status(500).json({ error: 'An error occurred while checking availability.' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
