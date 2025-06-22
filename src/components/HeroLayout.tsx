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

// ★ 体験ボタン・光沢枠つきセクション
function VideoExperienceSection() {
  return (
    <section
      className="
        relative mx-auto my-12 w-full max-w-xl rounded-2xl shadow-2xl
        bg-white/40 backdrop-blur-md border-2 border-gray-200/60
        overflow-hidden flex flex-col items-center
      "
      style={{
        boxShadow:
          "0 6px 32px 0 #f7003133, 0 1.5px 4px #1cb5e033, 0 0 0 3px #fff4 inset",
      }}
    >
      {/* 上メッセージ（右→左閃光、グラデ） */}
      <p className="relative pt-6 text-center text-2xl sm:text-3xl font-extrabold tracking-wide drop-shadow-lg text-transparent bg-gradient-to-r from-slate-800 via-black to-white bg-clip-text shine-effect shine-reverse">
        Vertical &amp; horizontal swipe demo
        <span className="absolute left-0 top-0 w-full h-full pointer-events-none shine-glow-reverse"></span>
      </p>

      {/* ROOMボタン */}
      <div className="flex items-center justify-center gap-8 py-10 select-none">
        {/* R */}
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
        {/* 縦スワイプ */}
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
        {/* 横スワイプ */}
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
        {/* M */}
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
      {/* 下メッセージ（左→右閃光、グラデ） */}
      <p className="relative pb-6 text-center text-2xl sm:text-3xl font-extrabold tracking-wide drop-shadow-lg text-transparent bg-gradient-to-r from-slate-800 via-black to-white bg-clip-text shine-effect">
        Let&#39;s try R∞M video UI!
        <span className="absolute left-0 top-0 w-full h-full pointer-events-none shine-glow"></span>
      </p>

      {/* 光沢アニメーション用スタイル＋shineエフェクト */}
      <style>{`
        /* 上部閃光：右→左 */
        .shine-glow-reverse {
          background: linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.7) 50%, transparent 80%);
          position: absolute;
          top: 0; left: 120%;
          width: 50%; height: 100%;
          transform: skewX(-20deg);
          animation: shineMoveReverse 2.8s cubic-bezier(0.77,0,0.175,1) infinite;
          pointer-events: none;
        }
        @keyframes shineMoveReverse {
          0%   { left: 120%; }
          60%  { left: -75%; }
          100% { left: -75%; }
        }

        /* 下部閃光：左→右（元のshine-glow） */
        .shine-glow {
          background: linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.7) 50%, transparent 80%);
          position: absolute;
          top: 0; left: -75%;
          width: 50%; height: 100%;
          transform: skewX(-20deg);
          animation: shineMove 2.8s cubic-bezier(0.77,0,0.175,1) infinite;
          pointer-events: none;
        }
        @keyframes shineMove {
          0%   { left: -75%; }
          60%  { left: 120%; }
          100% { left: 120%; }
        }

        /* 立体＆閃光エフェクト */
        .drop-shadow-lg {
          text-shadow:
            0 2px 8px rgba(0,0,0,0.14),
            0 6px 24px rgba(0,0,0,0.13);
        }
        .shine-effect {
          position: relative;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}


// --- メインレイアウト ---
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
        <VideoExperienceSection />
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
