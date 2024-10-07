// pages/api/help-articles/index.js

import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session || session.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const articles = await prisma.helpArticle.findMany({
        include: {
          author: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.status(200).json({ success: true, articles });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch help articles.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
