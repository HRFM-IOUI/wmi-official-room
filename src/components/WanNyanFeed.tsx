"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---- スワイプ体験モーダル ----
function SwipeModal({
  open,
  onClose,
  direction, // "horizontal" or "vertical"
  children,
}: {
  open: boolean;
  onClose: () => void;
  direction: "horizontal" | "vertical";
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            x: direction === "horizontal" ? "100vw" : 0,
            y: direction === "vertical" ? "100vh" : 0,
            opacity: 0,
          }}
          animate={{
            x: 0,
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 60, damping: 22 },
          }}
          exit={{
            x: direction === "horizontal" ? "100vw" : 0,
            y: direction === "vertical" ? "100vh" : 0,
            opacity: 0,
            transition: { duration: 0.18 },
          }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur"
        >
          <div
            className={`
              w-full max-w-lg h-[80vh] bg-white bg-opacity-90 rounded-3xl shadow-2xl relative
              flex flex-col items-center justify-center
              ${direction === "horizontal" ? "animate-slideInRight" : "animate-slideInUp"}
            `}
          >
            <button
              className="absolute top-4 right-6 text-2xl text-gray-500 hover:text-[#f70031] transition"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---- 横スワイプ体験 ----
function HorizontalSwipeDemo() {
  // ダミー動画リスト
  const videos = [
    { url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "1. 横スワイプDEMO" },
    { url: "https://www.w3schools.com/html/movie.mp4", title: "2. 横スワイプDEMO" },
    { url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "3. 横スワイプDEMO" },
  ];
  const [current, setCurrent] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="relative w-[90vw] max-w-[400px] aspect-video overflow-hidden rounded-2xl shadow-xl border-2 border-[#f70031] bg-black">
        <video
          src={videos[current].url}
          className="w-full h-full object-contain"
          autoPlay
          loop
          muted
          controls
        />
        {/* 左右ボタン */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 text-[#f70031] text-2xl font-bold shadow hover:bg-white"
          onClick={() => setCurrent((prev) => (prev === 0 ? videos.length - 1 : prev - 1))}
        >
          ◀
        </button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 text-[#f70031] text-2xl font-bold shadow hover:bg-white"
          onClick={() => setCurrent((prev) => (prev === videos.length - 1 ? 0 : prev + 1))}
        >
          ▶
        </button>
      </div>
      <div className="mt-4 text-lg font-extrabold text-[#f70031]">{videos[current].title}</div>
      <div className="mt-2 text-xs text-gray-500">横スワイプ（またはボタン）で切り替え可能！</div>
    </div>
  );
}

// ---- 縦スワイプ体験 ----
function VerticalSwipeDemo() {
  const videos = [
    { url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "1. 縦スワイプDEMO" },
    { url: "https://www.w3schools.com/html/movie.mp4", title: "2. 縦スワイプDEMO" },
    { url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "3. 縦スワイプDEMO" },
  ];
  const [current, setCurrent] = useState(0);

  // スワイプイベントはPCでもできるように上下ボタンでも対応
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="relative w-[90vw] max-w-[400px] aspect-video overflow-hidden rounded-2xl shadow-xl border-2 border-[#1cb5e0] bg-black">
        <video
          src={videos[current].url}
          className="w-full h-full object-contain"
          autoPlay
          loop
          muted
          controls
        />
        {/* 上下ボタン */}
        <button
          className="absolute top-2 left-1/2 -translate-x-1/2 p-2 rounded-full bg-white/80 text-[#1cb5e0] text-2xl font-bold shadow hover:bg-white"
          onClick={() => setCurrent((prev) => (prev === 0 ? videos.length - 1 : prev - 1))}
        >
          ▲
        </button>
        <button
          className="absolute bottom-2 left-1/2 -translate-x-1/2 p-2 rounded-full bg-white/80 text-[#1cb5e0] text-2xl font-bold shadow hover:bg-white"
          onClick={() => setCurrent((prev) => (prev === videos.length - 1 ? 0 : prev + 1))}
        >
          ▼
        </button>
      </div>
      <div className="mt-4 text-lg font-extrabold text-[#1cb5e0]">{videos[current].title}</div>
      <div className="mt-2 text-xs text-gray-500">縦スワイプ（またはボタン）で切り替え可能！</div>
    </div>
  );
}

// ---- メインコンポーネント ----
export default function VideoUIExperience() {
  const [showHorizontal, setShowHorizontal] = useState(false);
  const [showVertical, setShowVertical] = useState(false);

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center pt-20 pb-20">
      {/* R 〇 〇 M ボタンUI */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <span className="text-3xl sm:text-4xl font-black text-[#f70031] drop-shadow">R</span>
        {/* 横スワイプ */}
        <button
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[#f70031] via-[#ff6a00] to-[#ffd700] shadow-2xl flex items-center justify-center transition hover:scale-110"
          aria-label="横スワイプ体験"
          onClick={() => setShowHorizontal(true)}
        >
          <span className="text-white text-2xl font-bold">→</span>
        </button>
        {/* 縦スワイプ */}
        <button
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1cb5e0] via-[#000046] to-[#00f2fe] shadow-2xl flex items-center justify-center transition hover:scale-110"
          aria-label="縦スワイプ体験"
          onClick={() => setShowVertical(true)}
        >
          <span className="text-white text-2xl font-bold">↑</span>
        </button>
        <span className="text-3xl sm:text-4xl font-black text-[#f70031] drop-shadow">M</span>
      </div>

      <div className="text-lg sm:text-xl font-semibold mb-4 text-[#222]">
        Please select the video UI you would like to experience.！
      </div>

      {/* 横スワイプ体験モーダル */}
      <SwipeModal
        open={showHorizontal}
        onClose={() => setShowHorizontal(false)}
        direction="horizontal"
      >
        <HorizontalSwipeDemo />
      </SwipeModal>

      {/* 縦スワイプ体験モーダル */}
      <SwipeModal
        open={showVertical}
        onClose={() => setShowVertical(false)}
        direction="vertical"
      >
        <VerticalSwipeDemo />
      </SwipeModal>
    </div>
  );
}
