"use client";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

type WanNyanVideo = {
  id: string;
  type: "youtube" | "firestore";
  url: string;
  title: string;
};

export default function NyanFeed() {
  const [videos, setVideos] = useState<WanNyanVideo[]>([]);
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 動画リスト取得
  useEffect(() => {
    const fetchVideos = async () => {
      const colRef = collection(db, "wannyanVideos");
      const snapshot = await getDocs(colRef);
      const items = snapshot.docs.map((doc) => ({
        ...(doc.data() as Omit<WanNyanVideo, "id">),
        id: doc.id,
      }));
      setVideos(items);
    };
    fetchVideos();
  }, []);

  // 横スワイプ
  const touchX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(delta) > 80) {
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 300);
      if (delta < 0) {
        // 右→左（次）
        setActive((a) => (a + 1) % videos.length);
      }
      if (delta > 0) {
        // 左→右（前）
        setActive((a) => (a - 1 + videos.length) % videos.length);
      }
    }
    touchX.current = null;
  };

  // PC用：←→キー対応
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (videos.length < 2) return;
      if (e.key === "ArrowRight") {
        setActive((a) => (a + 1) % videos.length);
      }
      if (e.key === "ArrowLeft") {
        setActive((a) => (a - 1 + videos.length) % videos.length);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [videos.length]);

  // 再生/停止状態
  useEffect(() => {
    videos.forEach((v, i) => {
      const videoEl = videoRefs.current[i];
      if (!videoEl) return;
      if (i === active) {
        videoEl.currentTime = 0;
        videoEl.play().catch(() => {});
        videoEl.muted = muted;
      } else {
        videoEl.pause();
      }
    });
  }, [active, muted, videos.length]);

  if (!videos.length) {
    return <div className="text-center text-gray-600 py-20">動画を読み込み中…</div>;
  }

  // 前・今・次のindex
  const prev = (active - 1 + videos.length) % videos.length;
  const next = (active + 1) % videos.length;

  // クロスフェードCSS
  const base =
    "absolute top-0 left-0 w-full h-full flex items-center justify-center transition-opacity duration-400";
  const hiddenStyle = { opacity: 0, zIndex: 0, pointerEvents: "none" } as const;
  const activeStyle = { opacity: 1, zIndex: 10, pointerEvents: "auto" } as const;

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      {/* 動画（前・今・次）同時レンダリング＋opacity切り替え */}
      <div className="relative w-full h-full" style={{ minHeight: "100vh" }}>
        {/* 前 */}
        <div
          className={base}
          style={prev === active ? activeStyle : hiddenStyle}
        >
          <video
            ref={(el) => {
              if (el) videoRefs.current[prev] = el;
            }}
            src={videos[prev].type === "firestore" ? videos[prev].url : undefined}
            className="w-full h-full object-cover"
            autoPlay
            muted={muted}
            loop
            playsInline
            style={{ background: "#000" }}
          />
        </div>
        {/* 今 */}
        <div
          className={base}
          style={activeStyle}
        >
          <video
            ref={(el) => {
              if (el) videoRefs.current[active] = el;
            }}
            src={videos[active].type === "firestore" ? videos[active].url : undefined}
            className="w-full h-full object-cover"
            autoPlay
            muted={muted}
            loop
            playsInline
            style={{ background: "#000" }}
          />
          {/* オーバーレイUI（タイトル・コントロール） */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 flex flex-col gap-2 bg-gradient-to-t from-black/60 to-transparent">
            <div className="text-lg font-bold text-white drop-shadow">
              {videos[active].title}
            </div>
          </div>
        </div>
        {/* 次 */}
        <div
          className={base}
          style={next === active ? activeStyle : hiddenStyle}
        >
          <video
            ref={(el) => {
              if (el) videoRefs.current[next] = el;
            }}
            src={videos[next].type === "firestore" ? videos[next].url : undefined}
            className="w-full h-full object-cover"
            autoPlay
            muted={muted}
            loop
            playsInline
            style={{ background: "#000" }}
          />
        </div>
      </div>

      {/* コントロールUI */}
      <div className="absolute top-4 right-4 flex flex-col gap-4 items-center">
        <button
          onClick={() => setMuted((m) => !m)}
          className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center"
        >
          {muted ? (
            <span className="text-white text-2xl">🔇</span>
          ) : (
            <span className="text-white text-2xl">🔊</span>
          )}
        </button>
      </div>
      {/* スワイプ案内 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl opacity-60 select-none pointer-events-none">
        <span className="mx-2">← 横スワイプ →</span>
      </div>
    </div>
  );
}
