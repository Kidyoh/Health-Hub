// /pages/api/health-news.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_KEY = process.env.HEALTH_NEWS_API_KEY || 'ab0ea487c0c547b9818e278b6b6abb0b';
const HEALTH_NEWS_API_URL = `https://newsapi.org/v2/top-headlines?category=health&apiKey=${API_KEY}`;

export default async function handler(req, res) {
  try {
    const response = await fetch(HEALTH_NEWS_API_URL);
    const newsData = await response.json();

    if (newsData.status !== 'ok') {
      return res.status(500).json({ message: 'Failed to fetch health news.' });
    }

    const articles = newsData.articles.map(article => ({
      title: article.title || 'Untitled',
      content: article.description || 'No description available.',
      author: article.author || 'Unknown author',
      url: article.url || '#',
      imageUrl: article.urlToImage || '/public/images/blog/blog-img1.jpg',
      category: 'Health',
    }));

    // Save new articles to the database only if they don't exist
    const savedNews = await Promise.all(
      articles.map(async (article) => {
        const existingArticle = await prisma.medicalInformation.findUnique({
          where: { url: article.url }, // Use the URL to check for duplicates
        });

        if (!existingArticle) {
          return prisma.medicalInformation.create({
            data: {
              title: article.title,
              content: article.content,
              keywords: article.author,
              category: 'Health',
              author: article.author,
              url: article.url,
            },
          });
        }
        return existingArticle; 
      })
    );

    return res.status(200).json({ success: true, articles: savedNews });
  } catch (error) {
    console.error('Error fetching or saving health news:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}
