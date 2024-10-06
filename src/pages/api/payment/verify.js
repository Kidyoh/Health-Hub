import Chapa from 'chapa';
import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const myChapa = new Chapa(process.env.CHAPA_SECRET_KEY);
const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  console.log(session);

  if (req.method === 'POST') {
    const { tx_ref } = req.body;

    try {
      const response = await myChapa.verify(tx_ref);
      console.log(response);

      // Find the transaction for the user
      const transaction = await prisma.transaction.findFirst({
        where: { userId: session.id, tx_ref: tx_ref},
      });

      if (transaction) {
        // If a transaction exists, update it
        await prisma.transaction.update({
            where: { id: transaction.id },
            data: { status: response.status },
          });
          console.log(`Transaction with id ${transaction.id} updated.`);
      } else {
        console.log(`No transaction found for user with id ${session.id}`);
      }

      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while verifying the transaction.' });
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