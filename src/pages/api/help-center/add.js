// /pages/api/help-articles/add.js

import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
      const session = req.session.get('user');

      // Ensure the user is logged in
      if (!session) {
            return res.status(401).json({ error: 'Unauthorized' });
      }

      // Optionally check if the user has admin rights (if you want to restrict this action)
      if (session.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Forbidden' });
      }

      if (req.method === 'POST') {
            const { title, content, category } = req.body;

            try {
                  const newArticle = await prisma.helpArticle.create({
                        data: {
                              title,
                              content,
                              category,
                        },
                  });

                  return res.status(201).json({ success: true, article: newArticle });
            } catch (error) {
                  console.error('Error adding help article:', error);
                  return res.status(500).json({ error: 'Failed to add help article' });
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
