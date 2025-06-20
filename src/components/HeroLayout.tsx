"use client";
import React, { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import Greeting from "./Greeting";
import WanNyanFeed from "./WanNyanFeed";
import SocialNewsTabs from "./SocialNewsTabs";
import AccessibilityModal from "./AccessibilityModal";
import NavigationModal from "./NavigationModal";
import FloatingButtons from "./FloatingButtons";

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
        <WanNyanFeed />
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
