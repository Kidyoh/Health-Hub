// /pages/api/appointments/available-slots.js

import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';
import { addHours, format, startOfDay, endOfDay, parseISO } from 'date-fns';

const prisma = new PrismaClient();

async function handler(req, res) {
  const { facilityId, date } = req.query;

  if (req.method === 'GET') {
    if (!facilityId || !date) {
      return res.status(400).json({ error: 'Facility ID and date are required.' });
    }

    try {
      const parsedDate = parseISO(date);
      if (isNaN(parsedDate)) {
        return res.status(400).json({ error: 'Invalid date format.' });
      }

      const appointmentDuration = 1; // Default duration in hours
      const startHour = 9; // Start of working hours
      const endHour = 17; // End of working hours
      const timeSlots = [];

      // Generate 1-hour time slots between 9:00 AM and 5:00 PM
      for (let hour = startHour; hour < endHour; hour += appointmentDuration) {
        timeSlots.push({ time: `${hour}:00 AM`, isAvailable: true });
      }

      // Fetch appointments for the facility (or doctor) for the given day
      const appointments = await prisma.appointment.findMany({
        where: {
          facilityId: parseInt(facilityId, 10),
          date: {
            gte: startOfDay(parsedDate),
            lte: endOfDay(parsedDate),
          },
        },
      });

      // Check booked slots and mark them unavailable
      appointments.forEach((appointment) => {
        const appointmentTime = format(appointment.date, 'H:mm a'); // Extract hour and minute
        timeSlots.forEach((slot) => {
          if (slot.time === appointmentTime) {
            slot.isAvailable = false; // Mark the slot as unavailable if booked
          }
        });
      });

      return res.status(200).json({ success: true, availableSlots: timeSlots });
    } catch (error) {
      console.error('Error fetching available slots:', error);
      return res.status(500).json({ error: 'Failed to retrieve available slots.' });
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
