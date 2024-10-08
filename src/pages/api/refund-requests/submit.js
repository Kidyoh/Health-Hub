import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.id;

  if (req.method === 'POST') {
    const { transactionId, reason } = req.body;

    try {
      // Convert transactionId to integer
      const parsedTransactionId = parseInt(transactionId, 10);

      // Validate if transactionId is a number
      if (isNaN(parsedTransactionId)) {
        return res.status(400).json({ error: 'Invalid transaction ID' });
      }

      // Create a refund request
      const refundRequest = await prisma.refundRequest.create({
        data: {
          userId: userId,
          transactionId: parsedTransactionId, // Use the parsed transactionId
          reason,
        },
      });

      return res.status(201).json({ success: true, refundRequest });
    } catch (error) {
      // Handle unique constraint error (P2002)
      if (error.code === 'P2002' && error.meta.target === 'RefundRequest_transactionId_key') {
        return res.status(400).json({ error: 'A refund request for this transaction has already been submitted.' });
      }
      console.error('Error creating refund request:', error);
      return res.status(500).json({ error: 'Failed to create refund request' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
