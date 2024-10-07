"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface HelpArticle {
      id: number;
      title: string;
      content: string;
      category: string;
}

const HelpCenter: React.FC = () => {
      const [articles, setArticles] = useState<HelpArticle[]>([]);
      const [loading, setLoading] = useState<boolean>(true);
      const [error, setError] = useState<string | null>(null);
      const router = useRouter();

      useEffect(() => {
            const fetchHelpArticles = async () => {
                  try {
                        const res = await axios.get<{ articles: HelpArticle[]; error?: string }>('/api/help-center');
                        if (res.data.error === 'Unauthorized') {
                              router.push('/login');
                        } else {
                              setArticles(res.data.articles);
                        }
                        setLoading(false);
                  } catch (error) {
                        setError('Failed to fetch help articles');
                        setLoading(false);
                  }
            };

            fetchHelpArticles();
      }, [router]);

      if (loading) return <p>Loading...</p>;
      if (error) return <p>{error}</p>;

      return (
            <div className="help-center">
                  <h1 className="text-3xl font-bold mb-4">Help Center</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => (
                              <div key={article.id} className="bg-white p-6 shadow-md rounded-md">
                                    <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                                    <p>{article.content.slice(0, 150)}...</p>
                                    <span className="block mt-2 text-sm text-gray-500">{article.category}</span>
                                    <Link href={`/user/support/help-center/${article.id}`}>
                                          <a className="text-blue-500 mt-4 block">Read More</a>
                                    </Link>
                              </div>
                        ))}
                  </div>
            </div>
      );
};

export default HelpCenter;
