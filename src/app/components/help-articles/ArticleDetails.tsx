"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

interface HelpArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  author: {
    firstName: string;
    lastName: string;
  };
}

const ArticleDetails: React.FC = () => {
  const [article, setArticle] = useState<HelpArticle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { id } = useParams() as { id: string };

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        const res = await axios.get(`/api/help-center/${id}`);
        setArticle(res.data.article);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch article');
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!article) return <p>No article found.</p>;

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  const truncatedContent = article.content.slice(0, 300); // Adjust the length as needed

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-4">Category: {article.category}</p>
      <p>
        {isExpanded ? article.content : `${truncatedContent}...`}
        <button
          onClick={toggleContent}
          className="text-blue-500 hover:underline ml-2"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      </p>
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Author</h3>
        <p>{article.author.firstName} {article.author.lastName}</p>
      </div>
    </div>
  );
};

export default ArticleDetails;