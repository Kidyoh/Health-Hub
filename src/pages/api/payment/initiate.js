import Chapa from 'chapa';
import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const myChapa = new Chapa(process.env.CHAPA_SECRET_KEY);
const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');
  console.log(session);

 
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { type, facilityId, date, doctor, email, firstName: first_name, lastName: last_name, amount, currency } = req.body;

    // Validate input
    if (!type || !facilityId || !date || (type === 'teleconsultation' && !doctor)) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
      let transactionData = {
        user: { connect: { id: session.id } },
        status: 'initialized',
      };

      if (type === 'appointment') {
        const appointment = await prisma.appointment.create({
          data: {
            userId: session.id,
            facilityId: parseInt(facilityId, 10),
            date: new Date(date),
            status: 'Scheduled',
          },
        });

        transactionData.appointment = { connect: { id: appointment.id } };
      } else if (type === 'teleconsultation') {
        const teleconsultation = await prisma.teleconsultation.create({
          data: {
            userId: session.id,
            date: new Date(date),
            doctor: doctor,
            status: 'Scheduled',
          },
        });

        transactionData.teleconsultation = { connect: { id: teleconsultation.id } };
      }

      const customerInfo = {
        amount: "1000", // The amount to be charged
        currency: "ETB", // The currency to be used
        email: session.email, // The customer's email
        first_name: session.first_name, // The customer's first name
        last_name: session.last_name, // The customer's last name
        userId: session.id // The user's ID
      };
      console.log(customerInfo);
    
      const response = await myChapa.initialize(customerInfo, { autoRef: true });

      // Add tx_ref to transactionData
      transactionData.tx_ref = response.tx_ref;

      // Save the transaction in your database
      await prisma.transaction.create({
        data: transactionData,
      });

      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while initializing the transaction.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});