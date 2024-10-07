import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  console.log('Request Method:', req.method);  // Log the request method

  const session = req.session.get('user');
  console.log('Session Data:', session);  // Log the session data
  
  if (!session || !session.id) {
    console.error('Unauthorized access attempt');  // Log unauthorized access attempt
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { title, content, category } = req.body;
    console.log('Request Body:', req.body);  // Log the request body

    if (!title || !content || !category) {
      console.error('Validation Error: All fields are required');  // Log validation error
      return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
      const article = await prisma.helpArticle.create({
        data: {
          title,
          content,
          category,
          authorId: session.id,  // Ensure the userId is correctly set
        },
      });

      console.log('Article Created:', article);  // Log the created article
      res.status(200).json({ success: true, article });
    } catch (error) {
      console.error('Error creating article:', error);  // Log the error
      res.status(500).json({ error: 'Failed to create help article.' });
    }
  } else {
    console.error('Method Not Allowed');  // Log method not allowed
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