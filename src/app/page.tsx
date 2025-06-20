"use client";
import React, { useState } from "react";
import MegaMenu from "@/components/MegaMenu";
import HeroLayout from "@/components/HeroLayout";
import FooterSection from "@/components/FooterSection";
import PostsHero from "@/components/PostsHero"; // PostsHeroをインポート

export default function HomePage() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen w-full relative z-10">
      {/* ナビゲーション */}
      <MegaMenu />

      {/* メイン */}
      <HeroLayout />

      {/* ここにPostsHeroを追加 */}
      <div className="mt-8">
        <PostsHero postCount={10} /> {/* 投稿数は必要に応じて設定 */}
      </div>

      {/* フッター */}
      <FooterSection />
    </div>
  );
}
