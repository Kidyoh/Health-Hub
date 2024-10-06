import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { appointmentId, amount } = req.body;

    if (!appointmentId || !amount) {
      return res.status(400).json({ error: 'Appointment ID and amount are required.' });
    }

    try {
      // Create Stripe Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects amount in cents
        currency: 'usd',
        metadata: { appointmentId: appointmentId.toString() },
      });

      // Store the transaction in the database
      const transaction = await prisma.transaction.create({
        data: {
          userId: session.id,
          appointmentId: parseInt(appointmentId, 10),
          txRef: paymentIntent.id,
          amount,
          status: 'pending',
        },
      });

      return res.status(201).json({ success: true, paymentIntent, transaction });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return res.status(500).json({ error: 'Failed to create transaction.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
