import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { articles as articlesData } from "../data/mockData";
import type { Article } from "../types";

const KnowledgePage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const articles: Article[] = articlesData as Article[];

  const categories = useMemo<string[]>(
    () => ["all", ...Array.from(new Set(articles.map((a) => a.category)))],
    [articles]
  );

  const filteredArticles = useMemo<Article[]>(
    () =>
      articles.filter((article) => {
        const matchesCategory =
          selectedCategory === "all" || article.category === selectedCategory;

        const q = searchQuery.trim().toLowerCase();
        const matchesSearch =
          q.length === 0 ||
          article.title.toLowerCase().includes(q) ||
          article.summary.toLowerCase().includes(q);

        return matchesCategory && matchesSearch;
      }),
    [articles, selectedCategory, searchQuery]
  );

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  // ✅ Wrapper thống nhất đích đến (externalUrl => <a/>, else => <Link/>)
  const LinkWrapper: React.FC<{
    article: Article;
    className?: string;
    children: React.ReactNode;
  }> = ({ article, className, children }) =>
    article.externalUrl ? (
      <a
        href={article.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    ) : (
      <Link to={`/knowledge/${article.id}`} className={className}>
        {children}
      </Link>
    );

  // ---- Thumbnail: ảnh/emoji đều bọc bằng LinkWrapper để “cùng link với Đọc thêm” ----
  const Thumb: React.FC<{ article: Article; height: "h-48" | "h-32" }> = ({
    article,
    height,
  }) => {
    return (
      <LinkWrapper article={article} className="block">
        {article.featuredImage ? (
          <img
            src={article.featuredImage}
            alt={article.title}
            loading="lazy"
            className={`${height} w-full object-cover`}
          />
        ) : (
          <div
            className={`${height} bg-gradient-to-br from-luxury-navy to-luxury-gold flex items-center justify-center`}
          >
            <div className="text-white opacity-70 text-6xl">
              {article.category === "basics" && "💎"}
              {article.category === "valuation" && "📊"}
              {article.category === "care" && "✨"}
              {article.category === "investment" && "📈"}
              {article.category === "certification" && "🏆"}
            </div>
          </div>
        )}
      </LinkWrapper>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-luxury-navy text-white py-16 md:py-20">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              {t("knowledge.title")}{" "}
              <span className="text-luxury-gold">
                {t("knowledge.titleHighlight")}
              </span>{" "}
              Center
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              {t("knowledge.description")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tìm kiếm + Lọc */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="mb-8"
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("knowledge.searchPlaceholder")}
                  className="w-full px-6 py-4 pl-12 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="mb-12"
            >
              <div className="flex flex-wrap gap-4 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-luxury-gold text-white shadow-lg"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-luxury-gold hover:text-luxury-gold"
                    }`}
                  >
                    {category === "all"
                      ? t("knowledge.allArticles")
                      : t(`knowledge.category.${category}`)}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bài nổi bật */}
      {selectedCategory === "all" && (
        <section className="py-12 bg-white">
          <div className="container-custom">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Bài viết nổi bật
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Bắt đầu với những hướng dẫn thiết yếu này để hiểu về kim cương
                và cách định giá chúng.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {articles.slice(0, 3).map((article) => (
                <motion.div
                  key={article.id}
                  variants={fadeInUp}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <Thumb article={article} height="h-48" />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-luxury-gold/10 text-luxury-gold px-3 py-1 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {article.readTime ?? "—"}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-bold mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.summary}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-luxury-navy rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {article.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <span className="text-sm text-gray-700">
                          {article.author}
                        </span>
                      </div>

                      {/* “Đọc thêm” dùng cùng logic với ảnh nhờ LinkWrapper */}
                      <LinkWrapper
                        article={article}
                        className="text-luxury-gold hover:text-luxury-navy font-medium text-sm"
                      >
                        Đọc thêm →
                      </LinkWrapper>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Tất cả bài viết */}
      <section className="py-12">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              {selectedCategory === "all"
                ? "Tất cả bài viết"
                : `${
                    selectedCategory.charAt(0).toUpperCase() +
                    selectedCategory.slice(1)
                  } – Bài viết`}
            </h2>
            <p className="text-gray-600">{filteredArticles.length} bài viết</p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredArticles.map((article) => (
              <motion.div
                key={article.id}
                variants={fadeInUp}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <Thumb article={article} height="h-32" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-luxury-gold/10 text-luxury-gold px-3 py-1 rounded-full text-sm font-medium">
                      {article.category}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {article.readTime ?? "—"}
                    </span>
                  </div>
                  <h3 className="text-lg font-serif font-bold mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {article.summary}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-luxury-navy rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {article.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">
                        {article.author}
                      </span>
                    </div>

                    {/* Cùng logic với ảnh */}
                    <LinkWrapper
                      article={article}
                      className="text-luxury-gold hover:text-luxury-navy font-medium text-sm"
                    >
                      Đọc →
                    </LinkWrapper>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredArticles.length === 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">
                Không tìm thấy bài viết
              </h3>
              <p className="text-gray-600 mb-6">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="btn btn-primary"
              >
                Xóa bộ lọc
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-luxury-navy text-white">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Sẵn sàng định giá viên kim cương của bạn?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Hãy dùng công cụ định giá nâng cao của chúng tôi để nhận ước tính
              tức thì.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/valuation" className="btn btn-gold text-lg px-8 py-4">
                Bắt đầu định giá
              </Link>
              <Link
                to="/contact"
                className="btn btn-secondary text-lg px-8 py-4"
              >
                Liên hệ chuyên gia
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default KnowledgePage;
