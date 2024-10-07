"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Textarea, TextInput, Card } from 'flowbite-react';

// Define the Article interface to type the articles state
interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
}

export default function HelpArticles() {
  // State for articles, title, content, and category
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  // Fetch existing help articles
  useEffect(() => {
    async function fetchArticles() {
      try {
        const { data } = await axios.get('/api/admin/help-articles');
        if (data.success) {
          setArticles(data.articles);
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      }
    }

    fetchArticles();
  }, []);

  // Function to handle article creation
  async function createArticle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/admin/help-articles/create', {
        title,
        content,
        category,
      });

      if (data.success) {
        // Add new article to the existing articles
        setArticles([data.article, ...articles]);
        setTitle('');
        setContent('');
        setCategory('');
      }
    } catch (error) {
      console.error('Failed to create article:', error);
    }
  }

  return (
    <div className="container mx-auto my-10 p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Manage Help Articles</h1>

      {/* Create new article form */}
      <Card className="p-8 mb-8">
        <form onSubmit={createArticle} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
              Title
            </label>
            <TextInput
              id="title"
              type="text"
              placeholder="Enter Article Title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              required
              helperText="Enter a unique title for the article"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
              Content
            </label>
            <Textarea
              id="content"
              placeholder="Write the article content here"
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
              required
              rows={5}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <TextInput
              id="category"
              type="text"
              placeholder="Enter Category"
              value={category}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)}
              required
              helperText="Specify the category of the article (e.g., Technical, General)"
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600">
            Create Article
          </Button>
        </form>
      </Card>

      {/* List of articles */}
      <h2 className="text-3xl font-bold mb-6 text-blue-600 text-center">Existing Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="p-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{article.title}</h3>
            <p className="text-gray-600 mb-4">{article.content}</p>
            <span className="text-gray-500 font-semibold">Category: {article.category}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
