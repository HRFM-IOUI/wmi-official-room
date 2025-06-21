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
  const [muted, setMuted] = useState(true);
  const [current, setCurrent] = useState(0);
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

  // 動画切り替え時に自動再生
  useEffect(() => {
    if (videoRefs.current[current]) {
      setTimeout(() => {
        videoRefs.current[current]?.play().catch(() => {});
      }, 100);
    }
  }, [current, videos]);

  // スワイプ判定
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = () => {
    const delta = touchStartY.current - touchEndY.current;
    if (delta > 50 && current < videos.length - 1) setCurrent((c) => c + 1); // 下→上
    if (delta < -50 && current > 0) setCurrent((c) => c - 1); // 上→下
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  if (videos.length === 0) {
    return (
      <div className="text-center text-gray-600 py-20 h-screen flex items-center justify-center">
        動画を読み込み中…
      </div>
    );
  }

  const v = videos[current];
  const videoSrc =
    v.type === "firestore"
      ? v.url
      : `https://www.youtube.com/embed/${v.url}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${v.url}`;

  return (
    <section
      className="w-screen h-screen flex items-center justify-center bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        overflow: "hidden",
        touchAction: "pan-y",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div className="absolute inset-0 z-0 w-full h-full flex items-center justify-center">
        {v.type === "firestore" ? (
          <video
            ref={(el) => {
              videoRefs.current[current] = el;
            }}
            src={videoSrc}
            className="w-full h-full object-contain bg-black"
            autoPlay
            muted={muted}
            loop
            playsInline
            controls
            style={{ background: "#000" }}
            onError={() => alert("動画の再生に失敗しました")}
          />
        ) : (
          <iframe
            src={videoSrc}
            title={v.title}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full object-contain bg-black"
            style={{ background: "#000" }}
          />
        )}
      </div>
      {/* タイトルを下部オーバーレイで表示 */}
      <div
        className="absolute bottom-10 w-full text-center z-10"
        style={{
          color: "#fff",
          textShadow: "0 2px 10px #000a",
          fontWeight: 700,
          fontSize: "1.3rem",
        }}
      >
        {v.title}
      </div>
    </section>
  );
}
