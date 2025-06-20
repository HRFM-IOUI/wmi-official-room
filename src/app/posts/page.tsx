"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase";

import StickyHeader from "@/components/StickyHeader";
import SearchModal from "@/components/ActionsModal";
import HighlightHeroCard from "@/components/HighlightHeroCard";
import HighlightCarousel from "@/components/HighlightCarousel";
import CategorySidebar from "@/components/CategorySidebar";
import CategorySwiper from "@/components/CategorySwiper";
import ArticleGrid from "@/components/ArticleGrid";

const CATEGORY_LIST = [
  "vision", "specs", "announcement", "usecase", "research",
  "culture", "technology", "education", "policy", "philosophy",
  "worldview", "uncategorized",
];

type Block = {
  type: "heading" | "text" | "image" | "video";
  content: string;
};

type Post = {
  id: string;
  title: string;
  createdAt: string | number | { seconds?: number };
  blocks?: Block[];
  image?: string;
  tags?: string[];
  category?: string;
  highlight?: boolean;
};

export default function PostsPage() {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true); // ローディング状態
  const [error, setError] = useState<string | null>(null); // エラーメッセージ

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>): Post => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title ?? "",
            createdAt: data.createdAt ?? "",
            blocks: Array.isArray(data.blocks)
              ? data.blocks.map((b: any): Block => {
                  if (
                    typeof b === "object" &&
                    "type" in b &&
                    "content" in b &&
                    typeof b.type === "string" &&
                    typeof b.content === "string" &&
                    ["heading", "text", "image", "video"].includes(b.type)
                  ) {
                    return { type: b.type as Block["type"], content: b.content };
                  }
                  return { type: "text", content: "" };
                })
              : [],
            image: typeof data.image === "string" ? data.image : undefined,
            tags: Array.isArray(data.tags) ? data.tags : [],
            category: typeof data.category === "string" ? data.category : "uncategorized",
            highlight: !!data.highlight,
          };
        });
        setPosts(fetched);
      } catch (err) {
        setError("データの取得に失敗しました。もう一度お試しください。");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // コンポーネントがマウントされた時のみ実行

  const highlightPosts = posts.filter((post) => post.highlight);
  const heroPost = highlightPosts[0] || null;
  const carouselHighlightPosts = highlightPosts.slice(1);

  const filteredPosts = posts.filter((post) => {
    const matchTitle = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = !selectedCategory || post.category === selectedCategory;
    const notHero = !heroPost || post.id !== heroPost.id;
    return matchTitle && matchCategory && notHero;
  }).slice(0, 4); // 2x2件

  return (
    <>
      {/* 🔝 スティッキーヘッダー */}
      <StickyHeader onSearchClick={() => setSearchOpen(true)} />

      {/* 🔍 モーダル検索（Apple風） */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setSearchOpen(false)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* 🔽 メイン記事セクション */}
      <main className="max-w-7xl w-full mx-auto px-2 sm:px-6 md:px-8 py-10 overflow-x-hidden">
        {/* 📰 件数見出し */}
        <h2 className="text-3xl font-extrabold text-[#192349] mb-6 tracking-tight drop-shadow">
          Latest News
        </h2>

        {/* ローディング状態またはエラー表示 */}
        {loading && <p className="text-center text-gray-500 py-12">Loading posts...</p>}
        {error && <p className="text-center text-red-500 py-12">{error}</p>}

        {/* コンテンツ */}
        {!loading && !error && (
          <div className="flex flex-col lg:flex-row gap-8 w-full">
            {/* 📚 サイドバー */}
            <div className="hidden lg:block min-w-[220px] max-w-[260px] flex-shrink-0">
              <CategorySidebar
                selected={selectedCategory}
                setSelected={setSelectedCategory}
              />
            </div>

            {/* 📱 メインカラム */}
            <div className="w-full min-w-0 flex flex-col">
              {/* モバイル用カテゴリSwiper */}
              <div className="lg:hidden mb-4">
                <CategorySwiper
                  categories={CATEGORY_LIST}
                  selected={selectedCategory}
                  setSelected={setSelectedCategory}
                />
              </div>

              {/* 🎯 Hero記事 */}
              {heroPost && (
                <section className="mb-8">
                  <HighlightHeroCard post={heroPost} />
                </section>
              )}

              {/* 📚 通常記事（2×2） */}
              <section>
                {filteredPosts.length === 0 ? (
                  <p className="text-center text-gray-400 py-12">No articles found.</p>
                ) : (
                  <ArticleGrid posts={filteredPosts} />
                )}
              </section>

              {/* 🎠 カルーセル表示（2件目以降） */}
              {carouselHighlightPosts.length > 0 && (
                <section className="mt-12">
                  <HighlightCarousel posts={carouselHighlightPosts} />
                </section>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
