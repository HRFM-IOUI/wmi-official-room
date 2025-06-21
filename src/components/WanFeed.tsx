// src/components/WanFeed.tsx
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

export default function WanFeed() {
  const [videos, setVideos] = useState<WanNyanVideo[]>([]);
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const touchY = useRef<number | null>(null);

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

  // スマホ: 縦スワイプ切り替え
  const handleTouchStart = (e: React.TouchEvent) => {
    touchY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchY.current === null) return;
    const delta = e.changedTouches[0].clientY - touchY.current;
    if (Math.abs(delta) > 80) {
      if (delta < 0 && active < videos.length - 1) setActive(a => a + 1);
      if (delta > 0 && active > 0) setActive(a => a - 1);
    }
    touchY.current = null;
  };

  // PC: キーボード＆ホイール対応
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" && active < videos.length - 1) setActive(a => a + 1);
      if (e.key === "ArrowUp" && active > 0) setActive(a => a - 1);
    };
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && active < videos.length - 1) setActive(a => a + 1);
      if (e.deltaY < 0 && active > 0) setActive(a => a - 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [active, videos.length]);

  // 切り替えたら動画自動再生
  useEffect(() => {
    const v = videoRefs.current[active];
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
      v.muted = muted;
    }
    videoRefs.current.forEach((vid, i) => {
      if (i !== active && vid) vid.pause();
    });
  }, [active, muted, videos.length]);

  if (!videos.length) {
    return <div className="text-center text-gray-600 py-20">Loading…</div>;
  }

  const v = videos[active];

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <video
        ref={el => { videoRefs.current[active] = el; }}
        src={v.type === "firestore" ? v.url : undefined}
        className="w-full h-full object-cover"
        autoPlay
        muted={muted}
        loop
        playsInline
        // controls={false}
        onClick={() =>
          videoRefs.current[active]?.paused
            ? videoRefs.current[active]?.play()
            : videoRefs.current[active]?.pause()
        }
        style={{ background: "#000" }}
      />
      {/* オーバーレイUI（タイトル・コントロール） */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 flex flex-col gap-2 bg-gradient-to-t from-black/60 to-transparent">
        <div className="text-lg font-bold text-white drop-shadow">{v.title}</div>
      </div>
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xl opacity-60 select-none pointer-events-none">
        {active > 0 && <span>↑</span>}
        {active < videos.length - 1 && <span>↓</span>}
      </div>
      {/* PC用ナビゲーションボタン */}
      <div className="hidden sm:flex absolute left-8 right-8 bottom-10 justify-between pointer-events-none">
        {active > 0 && (
          <button
            className="pointer-events-auto px-4 py-2 rounded-xl bg-white/60 text-black text-lg font-semibold shadow hover:bg-white/90"
            onClick={() => setActive(a => a - 1)}
          >
            ◀ Prev
          </button>
        )}
        {active < videos.length - 1 && (
          <button
            className="pointer-events-auto px-4 py-2 rounded-xl bg-white/60 text-black text-lg font-semibold shadow hover:bg-white/90"
            onClick={() => setActive(a => a + 1)}
          >
            Next ▶
          </button>
        )}
      </div>
    </div>
  );
}
