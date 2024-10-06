import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const chapaPayload = req.body;

  if (chapaPayload.status === 'success') {
    const { tx_ref } = chapaPayload;
    const teleconsultationId = parseInt(tx_ref.split('-')[1], 10);

    // Update the teleconsultation with session URL and status
    await prisma.teleconsultation.update({
      where: { id: teleconsultationId },
      data: {
        status: 'Approved',
        sessionUrl: `https://healthub.daily.co/${teleconsultationId}`, // Use Daily.co URL here
      },
    });
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
}
