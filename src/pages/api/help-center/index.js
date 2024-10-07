// /pages/api/help-articles/index.js

import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
      const session = req.session.get('user');

      // Optionally check if the user is authenticated (if the help center is protected)
      if (!session) {
            return res.status(401).json({ error: 'Unauthorized' });
      }

      if (req.method === 'GET') {
            try {
                  const articles = await prisma.helpArticle.findMany();
                  return res.status(200).json({ success: true, articles });
            } catch (error) {
                  console.error('Error fetching help articles:', error);
                  return res.status(500).json({ error: 'Failed to fetch help articles' });
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
