// /pages/api/help-articles/[id].ts

import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
      const session = req.session.get('user');

      if (!session) {
            return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.query;

      if (req.method === 'GET') {
            try {
                  const article = await prisma.helpArticle.findUnique({
                        where: { id: Number(id) },
                        include: {
                              author: {
                                    select: { firstName: true, lastName: true, email: true },
                              },
                        },
                  });

                  if (!article) {
                        return res.status(404).json({ error: 'Article not found' });
                  }

                  return res.status(200).json({ success: true, article });
            } catch (error) {
                  console.error('Error fetching help article:', error);
                  return res.status(500).json({ error: 'Failed to fetch help article' });
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
