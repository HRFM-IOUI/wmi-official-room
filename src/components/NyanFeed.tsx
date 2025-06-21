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

  // 横スワイプで切り替え
  const touchX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(delta) > 60) {
      if (delta < 0) setActive(a => (a + 1) % videos.length); // 右スワイプ:次へ
      if (delta > 0) setActive(a => (a - 1 + videos.length) % videos.length); // 左スワイプ:前へ
    }
    touchX.current = null;
  };

  // 前後動画も同時にレンダリング＆即再生
  useEffect(() => {
    videos.forEach((_, i) => {
      const v = videoRefs.current[i];
      if (!v) return;
      if (i === active) {
        v.currentTime = 0;
        v.play().catch(() => {});
        v.muted = muted;
      } else {
        v.pause();
        v.currentTime = 0;
      }
    });
  }, [active, muted, videos.length]);

  if (!videos.length) {
    return <div className="text-center text-gray-600 py-20">動画を読み込み中…</div>;
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ overflow: "hidden" }}
    >
      {/* 全動画を重ねて配置、見えるのはactiveと前後だけ */}
      {videos.map((v, i) => {
        // 今・前・次だけ重ねてopacity切り替え
        const show =
          i === active ||
          i === (active - 1 + videos.length) % videos.length ||
          i === (active + 1) % videos.length;
        return (
          <video
            key={v.id}
            ref={el => {
              videoRefs.current[i] = el;
            }}
            src={v.type === "firestore" ? v.url : undefined}
            className={`
              absolute w-full h-full object-cover
              transition-opacity duration-300
              ${i === active ? "opacity-100 z-20" : show ? "opacity-0 z-10" : "opacity-0 pointer-events-none z-0"}
            `}
            autoPlay={i === active}
            muted={muted}
            loop
            playsInline
            // controls={false}
            style={{
              background: "#000",
              left: 0,
              top: 0,
            }}
          />
        );
      })}
      {/* オーバーレイUI（タイトル・コントロール） */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 flex flex-col gap-2 bg-gradient-to-t from-black/60 to-transparent z-30 pointer-events-none">
        <div className="text-lg font-bold text-white drop-shadow">{videos[active].title}</div>
      </div>
      <div className="absolute top-4 right-4 flex flex-col gap-4 items-center z-30">
        <button
          onClick={() => setMuted((m) => !m)}
          className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center pointer-events-auto"
        >
          {muted ? (
            <span className="text-white text-2xl">🔇</span>
          ) : (
            <span className="text-white text-2xl">🔊</span>
          )}
        </button>
      </div>
      {/* スワイプ案内（← →） */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-3xl opacity-40 select-none pointer-events-none z-30">
        {videos.length > 1 && (
          <>
            <span className="mr-6">←</span>
            <span className="ml-6">→</span>
          </>
        )}
      </div>
    </div>
  );
}
