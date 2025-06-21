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

  // 最初の動画だけは確実に再生
  useEffect(() => {
    if (videos.length > 0 && videoRefs.current[0]) {
      setTimeout(() => {
        videoRefs.current[0]?.play().catch(() => {});
      }, 0);
    }
  }, [videos]);

  // 再生・一時停止
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
        bg-gradient-to-b from-[#181818e6] via-[#f70031bb] to-[#ffd70033]
        pb-0 pt-0
      "
      style={{
        scrollSnapType: "y mandatory",
        overscrollBehaviorY: "contain",
        background:
          "linear-gradient(135deg,rgba(16,16,16,0.96) 0%,rgba(247,0,49,0.88) 80%,rgba(255,215,0,0.17) 100%)"
      }}
    >
      {videos.map((v, index) => (
        <div
          key={v.id}
          className="
            snap-start
            w-full h-screen
            flex justify-center items-center
            relative
            bg-black bg-opacity-70
            transition-all duration-300
          "
          style={{
            minHeight: "100vh",
            maxHeight: "100vh",
            height: "100vh",
            borderRadius: 0,
            boxShadow: "0 2px 24px 0 rgba(0,0,0,0.14)",
          }}
        >
          {/* 動画本体 */}
          <div
            className="absolute inset-0 flex justify-center items-center"
            onClick={() => togglePlay(index)}
          >
            {v.type === "firestore" ? (
              <video
                ref={(el): void => {
                  videoRefs.current[index] = el;
                }}
                src={v.url}
                className="w-full h-full object-contain"
                autoPlay
                muted={muted}
                loop
                playsInline
                controls
                style={{
                  maxHeight: "100vh",
                  background: "rgba(16,16,16,0.88)",
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
                className="w-full h-full object-contain"
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
