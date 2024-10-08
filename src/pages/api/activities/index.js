import { withIronSession } from 'next-iron-session';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');
  console.log(">>>>Session is ", session);

  // If no session or id is found, return unauthorized
  if (!session || !session.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.id;

  try {
    // Fetch the latest 3 transactions for the user
    const transactions = await prisma.transaction.findMany({
      where: { userId: parseInt(userId) },
      select: {
        createdAt: true,
        amount: true,
        status: true,
        txRef: true,
      },
      take: 3,  // Fetch only the latest 3 records
      orderBy: {
        createdAt: 'desc'  // Order by the most recent
      }
    });

    // Fetch the latest 3 teleconsultations for the user
    const teleconsultations = await prisma.teleconsultation.findMany({
      where: { userId: parseInt(userId) },
      select: {
        date: true,
        status: true,  // Fetch the status of the teleconsultation
        teleconsultor: { select: { user: { select: { firstName: true, lastName: true } } } },
      },
      take: 3,  // Fetch only the latest 3 records
      orderBy: {
        date: 'desc'  // Order by the most recent
      }
    });

    // Combine activities into one array (fetching 3 from both)
    const activities = [
      ...transactions.map(tx => ({
        time: tx.createdAt.toLocaleTimeString(),
        action: `Payment of $${tx.amount} (${tx.status})`,
        color: "bg-primary",
        id: `TX-${tx.txRef}`,
        link: `/transactions/${tx.txRef}`,
      })),
      ...teleconsultations.map(consult => ({
        time: consult.date.toLocaleTimeString(),
        action: `Teleconsultation with ${consult.teleconsultor.user.firstName} ${consult.teleconsultor.user.lastName}`,
        color: "bg-warning",
        status: consult.status,  // Include the status of the teleconsultation
        link: `/teleconsultations/${consult.id}`,
      })),
    ];

    res.status(200).json({ activities });

  } catch (error) {
    console.error('Error fetching user activities:', error);
    res.status(500).json({ error: 'Failed to fetch user activities' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
