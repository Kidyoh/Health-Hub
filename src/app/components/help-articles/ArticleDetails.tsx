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

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!article) return <p className="text-center text-gray-500">No article found.</p>;

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  const truncatedContent = article.content.slice(0, 300); // Adjust the length as needed

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 md:px-0">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{article.title}</h1>
        <p className="text-sm text-gray-500 italic mb-6">Category: {article.category}</p>
        
        <div className="text-gray-700 leading-relaxed text-lg">
          {isExpanded ? article.content : `${truncatedContent}...`}
          <button
            onClick={toggleContent}
            className="ml-2 text-blue-600 hover:text-blue-800 font-semibold focus:outline-none"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-2xl font-semibold text-gray-900">Author</h3>
          <p className="text-lg text-gray-700">{article.author.firstName} {article.author.lastName}</p>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetails;
