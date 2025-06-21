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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartY = useRef<number | null>(null);

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

  // 動画自動再生
  useEffect(() => {
    if (videos.length > 0 && videoRef.current) {
      setTimeout(() => {
        videoRef.current?.play().catch(() => {});
      }, 0);
    }
  }, [videos, currentIndex]);

  // スワイプ検出（スマホ/タブレット用）
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (deltaY > 50 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (deltaY < -50 && currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    touchStartY.current = null;
  };

  // キーボード上下対応（PC用）
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" && currentIndex < videos.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else if (e.key === "ArrowUp" && currentIndex > 0) {
        setCurrentIndex((i) => i - 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentIndex, videos.length]);

  if (videos.length === 0) {
    return <div className="text-center text-gray-600 py-20">動画を読み込み中…</div>;
  }

  const v = videos[currentIndex];

  return (
    <section
      className="
        w-full min-h-screen flex flex-col items-center justify-center
        bg-black relative overflow-hidden
      "
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ height: "100vh" }}
    >
      {/* 枠グラデーションはここで */}
      <div
        className="
          w-full h-full flex flex-col justify-center items-center
        "
        style={{
          background: "radial-gradient(circle at 50% 50%, #f7003177 0%, #ffd70055 60%, #111 100%)"
        }}
      >
        <div
          className="w-[94vw] max-w-lg aspect-video rounded-2xl shadow-xl flex items-center justify-center border-4 border-[#fff5] bg-black bg-opacity-70"
        >
          {v.type === "firestore" ? (
            <video
              ref={videoRef}
              src={v.url}
              className="w-full h-full object-contain rounded-2xl bg-black"
              autoPlay
              muted={muted}
              loop
              playsInline
              controls
              style={{
                background: "#000d",
                maxHeight: "70vh",
              }}
              onError={() => alert("動画の再生に失敗しました")}
            />
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${v.url}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${v.url}`}
              title={v.title}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full object-contain rounded-2xl bg-black"
              style={{
                maxHeight: "70vh",
              }}
            />
          )}
        </div>
        {/* タイトル */}
        <div className="mt-4 text-lg font-bold text-white drop-shadow text-center">
          {v.title}
        </div>
        {/* インデックス表示 */}
        <div className="absolute top-4 right-4 text-white/80 text-sm select-none">
          {currentIndex + 1} / {videos.length}
        </div>
      </div>
    </section>
  );
}
