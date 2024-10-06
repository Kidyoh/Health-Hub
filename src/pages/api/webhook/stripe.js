import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event: checkout.session.completed indicates a successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Update the teleconsultation with the session URL and status
    const teleconsultationId = session.metadata.teleconsultationId;

    await prisma.teleconsultation.update({
      where: { id: parseInt(teleconsultationId, 10) },
      data: {
        status: 'Approved',
        sessionUrl: `https://healthhub.daily.co/${teleconsultationId}`,  // Use Daily.co URL here
      },
    });
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
}
