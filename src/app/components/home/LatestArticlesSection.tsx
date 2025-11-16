"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "@/hooks/useTranslations";
import styles from "./LatestArticlesSection.module.css";

interface ArticleData {
  id: string;
  title: string;
  meta: string;
  image: string;
  url?: string;
}

interface LatestArticlesSectionProps {
  className?: string;
  articles?: ArticleData[];
  showViewAll?: boolean;
  onViewAllClick?: () => void;
}

const LatestArticlesSection: React.FC<LatestArticlesSectionProps> = ({
  className,
  articles,
  showViewAll = true,
  onViewAllClick,
}) => {
  const t = useTranslations("HomePage");

  // Default article data if none provided
  const defaultArticles: ArticleData[] = [
    {
      id: "1",
      title: t("articleTitle1"),
      meta: t("articleMeta1"),
      image: "/gh_large.png",
      url: "#",
    },
    {
      id: "2",
      title: t("articleTitle2"),
      meta: t("articleMeta2"),
      image: "/gh_large.png",
      url: "#",
    },
    {
      id: "3",
      title: t("articleTitle3"),
      meta: t("articleMeta3"),
      image: "/gh_large.png",
      url: "#",
    },
  ];

  const displayArticles = articles || defaultArticles;

  const handleViewAllClick = () => {
    if (onViewAllClick) {
      onViewAllClick();
    }
  };

  const handleArticleClick = (article: ArticleData) => {
    if (article.url && article.url !== "#") {
      window.open(article.url, "_blank");
    }
  };

  return (
    <section className={`${styles.articles} ${className || ""}`}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{t("latestArticles")}</h2>
        {showViewAll && (
          <button onClick={handleViewAllClick} className={styles.viewAll}>
            {t("viewAll")}
          </button>
        )}
      </div>
      <div className={styles.articlesList}>
        {displayArticles.map((article) => (
          <article
            key={article.id}
            className={styles.article}
            onClick={() => handleArticleClick(article)}
            style={{
              cursor:
                article.url && article.url !== "#" ? "pointer" : "default",
            }}
          >
            <Image
              src={article.image}
              alt={article.title}
              width={60}
              height={60}
              className={styles.articleImage}
            />
            <div className={styles.articleContent}>
              <h3 className={styles.articleTitle}>{article.title}</h3>
              <p className={styles.articleMeta}>{article.meta}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LatestArticlesSection;
