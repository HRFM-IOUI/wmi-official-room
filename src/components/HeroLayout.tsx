// HeroLayout.tsx
"use client";
import React, { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import Greeting from "./Greeting";
import SocialNewsTabs from "./SocialNewsTabs";
import AccessibilityModal from "./AccessibilityModal";
import NavigationModal from "./NavigationModal";
import FloatingButtons from "./FloatingButtons";
import { BsArrowDownUp, BsArrowLeftRight } from "react-icons/bs";

// ★ 体験ボタン専用コンポーネント
function VideoExperienceButtons() {
  return (
    <div className="flex items-center justify-center gap-8 my-12 select-none">
      {/* R - 立体青グラデ */}
      <span
        className="text-3xl font-extrabold tracking-widest px-4 py-2 rounded-xl shadow-lg"
        style={{
          background: "linear-gradient(120deg, #1cb5e0 0%, #000851 100%)",
          color: "#fff",
          textShadow: "0 3px 14px #1cb5e088, 0 1.5px 4px #00085199",
          border: "2px solid #fff6",
          boxShadow: "0 6px 32px #1cb5e055, 0 1.5px 4px #00085144",
          letterSpacing: "0.1em",
        }}
      >
        R
      </span>
      {/* 縦スワイプ体験ボタン */}
      <a
        href="/wan"
        className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-[#f70031] to-[#ffd700] shadow-2xl hover:scale-110 transition border-4 border-white/70"
        title="縦スワイプ動画体験"
        style={{
          boxShadow: "0 6px 32px #f7003166, 0 1.5px 4px #ffd70066",
        }}
      >
        <BsArrowDownUp className="text-white text-3xl drop-shadow-lg" />
      </a>
      {/* 横スワイプ体験ボタン */}
      <a
        href="/nyan"
        className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-[#1cb5e0] to-[#000851] shadow-2xl hover:scale-110 transition border-4 border-white/70"
        title="横スワイプ動画体験"
        style={{
          boxShadow: "0 6px 32px #1cb5e066, 0 1.5px 4px #00085166",
        }}
      >
        <BsArrowLeftRight className="text-white text-3xl drop-shadow-lg" />
      </a>
      {/* M - 立体赤グラデ */}
      <span
        className="text-3xl font-extrabold tracking-widest px-4 py-2 rounded-xl shadow-lg"
        style={{
          background: "linear-gradient(120deg, #f70031 0%, #ffd700 100%)",
          color: "#fff",
          textShadow: "0 3px 14px #f70031aa, 0 1.5px 4px #ffd70099",
          border: "2px solid #fff6",
          boxShadow: "0 6px 32px #f7003155, 0 1.5px 4px #ffd70044",
          letterSpacing: "0.1em",
        }}
      >
        M
      </span>
    </div>
  );
}

export default function HeroLayout() {
  const [clientWidth, setClientWidth] = useState<number | null>(null);
  const [isAccessibilityOpen, setAccessibilityOpen] = useState(false);
  const [isNavigationOpen, setNavigationOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      setClientWidth(window.innerWidth);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center min-h-[calc(100vh-180px)] pt-6 sm:pt-12 pb-10">
      {/* メインコンテンツ */}
      <main className="flex flex-col items-center w-full max-w-full px-4 sm:px-6 lg:mx-auto lg:max-w-[1500px] transition-all">
        <HeroSection />
        <Greeting />
        <VideoExperienceButtons />
        <SocialNewsTabs />
      </main>

      {/* セクション区切り */}
      <div className="w-full h-0.5 sm:h-1 mt-6 sm:mt-10 bg-gradient-to-r from-gray-100 to-gray-300" />

      {/* フローティングボタン */}
      <FloatingButtons
        onOpenAccessibility={() => setAccessibilityOpen(true)}
        onOpenNavigation={() => setNavigationOpen(true)}
      />

      {/* アクセシビリティモーダル */}
      {isAccessibilityOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setAccessibilityOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="relative">
            <AccessibilityModal />
            <button
              onClick={() => setAccessibilityOpen(false)}
              className="absolute top-4 right-4 text-2xl text-white hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* ナビゲーションモーダル */}
      {isNavigationOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setNavigationOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="relative">
            <NavigationModal />
            <button
              onClick={() => setNavigationOpen(false)}
              className="absolute top-4 right-4 text-2xl text-white hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
