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
  const [playing, setPlaying] = useState(true);
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
      setPlaying(true);
    }
  }, [videos]);

  // 再生・一時停止
  const togglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  // ミュート切替
  const toggleMute = () => {
    setMuted((m) => !m);
    videoRefs.current.forEach((v) => {
      if (v) v.muted = !muted;
    });
  };

  if (videos.length === 0) {
    return (
      <div className="text-center text-gray-600 py-20">動画を読み込み中…</div>
    );
  }

  return (
    <section
      className={`
        w-full min-h-screen
        overflow-y-scroll
        snap-y snap-mandatory
        bg-gradient-to-b from-[#f8f9fa] via-[#eaecef] to-[#f2f4f7]
        flex flex-col items-center
        pb-16 pt-4
      `}
      style={{
        scrollSnapType: "y mandatory",
        overscrollBehaviorY: "contain",
      }}
    >
      {videos.map((v, index) => {
        const isPC = typeof window !== "undefined" && window.innerWidth >= 1024;
        // PCは中央に、スマホは全幅に
        return (
          <div
            key={v.id}
            id={v.id}
            className={`
              snap-start
              flex flex-col justify-center items-center relative
              bg-black text-white
              transition-all duration-300
              ${isPC ? "w-[560px] h-[80vh] my-16 rounded-2xl shadow-2xl border border-gray-200" : "w-full h-screen"}
            `}
            style={{
              margin: isPC ? "48px auto" : "40px 0",
              boxShadow: isPC
                ? "0 8px 32px rgba(0,0,0,0.13), 0 1.5px 4px rgba(25,35,73,0.09)"
                : undefined,
              borderRadius: isPC ? 24 : undefined,
              border: isPC ? "2px solid #fff" : undefined,
              background: "#000",
            }}
          >
            {/* 動画本体（PC/スマホ両対応） */}
            <div
              className="flex justify-center items-center w-full h-full"
              style={{
                minHeight: isPC ? "70vh" : "75vh",
                maxHeight: isPC ? "75vh" : undefined,
                paddingTop: isPC ? 0 : "6vw",
                paddingBottom: isPC ? 0 : "6vw",
              }}
              onClick={() => togglePlay(index)}
            >
              {v.type === "firestore" ? (
                <video
                  ref={(el): void => {
                    videoRefs.current[index] = el;
                  }}
                  src={v.url}
                  className={`
                    ${isPC ? "w-full h-full rounded-xl border border-white shadow-lg" : "w-full h-[calc(100vw*1.33)] rounded-none"}
                    object-contain bg-black
                  `}
                  autoPlay
                  muted={muted}
                  loop
                  playsInline
                  controls
                  style={{
                    // 縦幅微調整：スマホは-100pxくらい、PCは高さfit
                    maxHeight: isPC ? "70vh" : "calc(100vh - 100px)",
                    background: "#111",
                  }}
                  onError={e => {
                    alert("動画の再生に失敗しました。");
                  }}
                />
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${v.url}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${v.url}`}
                  title={v.title}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className={`
                    ${isPC ? "w-full h-full rounded-xl border border-white shadow-lg" : "w-full h-[calc(100vw*1.33)] rounded-none"}
                    object-contain bg-black
                  `}
                  style={{
                    maxHeight: isPC ? "70vh" : "calc(100vh - 100px)",
                  }}
                />
              )}
            </div>
            {/* タイトル表示 */}
            <div className="w-full text-center mt-4 mb-4">
              <div className="text-lg font-extrabold drop-shadow-md">{v.title}</div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
