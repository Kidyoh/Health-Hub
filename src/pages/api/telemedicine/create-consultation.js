import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import axios from 'axios';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

async function handler(req, res) {
  const session = req.session.get('user');
  const { gateway, teleconsultorId, date, facilityId } = req.body;

  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  if (!gateway || !teleconsultorId || !date) return res.status(400).json({ error: 'Missing required fields' });

  try {
    // Check if teleconsultor exists
    const teleconsultor = await prisma.teleconsultor.findUnique({
      where: { id: parseInt(teleconsultorId, 10) },
      include: { user: true },
    });
    if (!teleconsultor) return res.status(404).json({ error: 'Teleconsultor not found' });

    // Create a teleconsultation
    const teleconsultation = await prisma.teleconsultation.create({
      data: {
        userId: session.id, // session user ID
        teleconsultorId: teleconsultor.id, // teleconsultor ID
        doctor: `${teleconsultor.user.firstName} ${teleconsultor.user.lastName}`,
        date: new Date(date),
        status: 'Pending Payment',
      },
    });

    // Create the appointment after teleconsultation is initialized
    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        userId: session.id,
        teleconsultationId: teleconsultation.id, // Link to teleconsultation
        facilityId: facilityId ? parseInt(facilityId, 10) : null,
        status: 'Pending',
      },
    });

    let paymentUrl;

    if (gateway === 'stripe') {
      // Create a Stripe checkout session
      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Consultation with ${teleconsultor.user.firstName}`,
              },
              unit_amount: Math.round(teleconsultor.rate * 100), // Ensure rate is in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_URL}/user/payment-success?teleconsultationId=${teleconsultation.id}&appointmentId=${appointment.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/user/payment-cancel`,
        metadata: {
          teleconsultationId: teleconsultation.id,
          appointmentId: appointment.id,
        },
      });
      paymentUrl = stripeSession.url;
    } else if (gateway === 'chapa') {
      // Chapa payment initialization
      const chapaResponse = await axios.post(
        'https://api.chapa.co/v1/transaction/initialize',
        {
          amount: teleconsultor.rate, // Teleconsultor's rate
          currency: 'ETB',
          email: session.email, // User's email from session
          tx_ref: `tx-${teleconsultation.id}`,
          callback_url: `${process.env.NEXT_PUBLIC_URL}/user/payment-success?teleconsultationId=${teleconsultation.id}&appointmentId=${appointment.id}`,
          return_url: `${process.env.NEXT_PUBLIC_URL}/user/payment-success?teleconsultationId=${teleconsultation.id}&appointmentId=${appointment.id}`,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          },
        }
      );
      paymentUrl = chapaResponse.data.data.checkout_url;
    }

    // Return success with the payment URL
    return res.status(201).json({
      success: true,
      paymentUrl,
      appointmentId: appointment.id,
      teleconsultationId: teleconsultation.id,
    });
  } catch (error) {
    console.error('Error creating consultation or initiating payment:', error);
    return res.status(500).json({ error: 'Failed to create consultation or initiate payment.' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
});
