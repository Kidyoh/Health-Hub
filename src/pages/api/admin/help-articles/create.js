// pages/api/help-articles/create.js

import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  if (!session || session.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
      const article = await prisma.helpArticle.create({
        data: {
          title,
          content,
          category,
          authorId: session.userId,  // Assuming the admin user is the author
        },
      });

      res.status(200).json({ success: true, article });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create help article.' });
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
