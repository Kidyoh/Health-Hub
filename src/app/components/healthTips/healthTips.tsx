"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "flowbite-react";
import { TbPoint } from "react-icons/tb";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import BlogImage from '../../../../public/images/blog/blog-img1.jpg'

interface NewsArticle {
  title: string;
  url: string;
  imageUrl: string;
  author: string;
  content: string;
  category: string;
}

const HealthTips = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthNews = async () => {
      try {
        const res = await fetch("/api/health-news");
        const data = await res.json();
        if (data.success) {
          setArticles(data.articles.slice(0, 10)); // Limit to 10 articles
        } else {
          console.error("Error fetching news:", data.message);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthNews();
  }, []);

  return (
    <>
      {loading ? (
        <div className="grid grid-cols-12 gap-30">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div className="lg:col-span-4 col-span-12" key={i}>
                <div className="rounded-xl shadow-md bg-white dark:bg-darkgray p-0 relative w-full break-words overflow-hidden">
                  <Skeleton height={200} />
                  <div className="px-6 pb-6">
                    <div className="flex items-center gap-3">
                      <Skeleton circle={true} height={40} width={40} />
                      <Skeleton width={80} height={20} />
                    </div>
                    <Skeleton width={100} height={20} className="mt-6" />
                    <Skeleton count={2} height={20} className="my-6" />
                    <div className="flex">
                      <Skeleton width={50} height={20} />
                      <Skeleton width={50} height={20} className="ms-auto" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-30">
          {articles.map((item, i) => (
            <div className="lg:col-span-4 col-span-12" key={i}>
              <Link href={item.url} className="group _blank">
                <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-0 relative w-full break-words overflow-hidden">
                  <div className="relative">
                    <Image
                      src={BlogImage}
                      alt={item.title}
                      width={400}
                      height={300}
                      className="w-full h-auto"
                    />
                    <Badge
                      color={"muted"}
                      className="absolute bottom-5 end-5 font-semibold rounded-sm bg-muted"
                    >
                      Health
                    </Badge>
                  </div>

                  <div className="px-6 pb-6">
                    <Image
                      src={BlogImage} // Use public image if no URL
                      className="h-10 w-10 rounded-full -mt-7 relative z-1"
                      alt={item.author}
                    />
                    <Badge color={"muted"} className="mt-6">
                      {item.category}
                    </Badge>
                    <h5 className="text-lg my-6 group-hover:text-primary line-clamp-2">
                      {item.title}
                    </h5>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default HealthTips;