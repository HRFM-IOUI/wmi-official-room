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

export default function WanNyanFeed() {
  const [videos, setVideos] = useState<WanNyanVideo[]>([]);
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

  // 最初の動画だけは確実に再生（再生成功保証パターン！）
  useEffect(() => {
    if (videos.length > 0 && videoRefs.current[0]) {
      setTimeout(() => {
        videoRefs.current[0]?.play().catch(() => {});
      }, 0);
    }
  }, [videos]);

  // タップで再生/一時停止
  const togglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  if (videos.length === 0) {
    return (
      <div className="text-center text-gray-600 py-20">動画を読み込み中…</div>
    );
  }

  return (
    <section
      className="
        w-full min-h-screen
        overflow-y-scroll
        snap-y snap-mandatory
        flex flex-col items-center
        bg-gradient-to-b from-[#181818e6] via-[#f70031bb] to-[#ffd70033]
        pb-10 pt-6
      "
      style={{
        scrollSnapType: "y mandatory",
        overscrollBehaviorY: "contain",
        // さらに黒の透明感を強調
        background:
          "linear-gradient(135deg,rgba(16,16,16,0.94) 0%,rgba(247,0,49,0.87) 80%,rgba(255,215,0,0.18) 100%)"
      }}
    >
      {videos.map((v, index) => (
        <div
          key={v.id}
          className="
            snap-start
            flex flex-col justify-center items-center
            relative w-full h-screen
            transition-all duration-300
          "
          style={{
            minHeight: "100vh",
            height: "100vh",
            background: "rgba(0,0,0,0.68)",
            borderRadius: "0px",
            boxShadow: "0 2px 24px 0 rgba(0,0,0,0.14)"
          }}
        >
          {/* 動画本体 */}
          <div
            className="flex justify-center items-center w-full h-full"
            onClick={() => togglePlay(index)}
          >
            {v.type === "firestore" ? (
              <video
                ref={(el): void => {
                  videoRefs.current[index] = el;
                }}
                src={v.url}
                className="w-full h-full object-contain bg-black"
                autoPlay
                muted={muted}
                loop
                playsInline
                controls
                style={{
                  maxHeight: "100vh",
                  background: "#111",
                }}
                onError={() => {
                  alert("動画の再生に失敗しました。");
                }}
              />
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${v.url}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${v.url}`}
                title={v.title}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full object-contain bg-black"
                style={{
                  maxHeight: "100vh",
                }}
              />
            )}
          </div>
          {/* タイトル */}
          <div className="absolute bottom-8 w-full text-center">
            <div className="text-lg font-extrabold drop-shadow-md text-white">
              {v.title}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
