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
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  // 最初の動画自動再生
  useEffect(() => {
    if (videos.length > 0 && containerRef.current) {
      setTimeout(() => {
        setCurrentIndex(0);
        containerRef.current?.scrollTo({ top: 0, behavior: "auto" });
      }, 0);
      setPlaying(true);
    }
  }, [videos]);

  // スクロール位置でcurrentIndex自動更新
  const handleScroll = () => {
    if (!containerRef.current) return;
    const snapEls = videoRefs.current;
    const scrollTop = containerRef.current.scrollTop;
    let bestIdx = 0;
    let minDiff = Infinity;
    snapEls.forEach((el, idx) => {
      if (!el) return;
      const diff = Math.abs(el.offsetTop - scrollTop);
      if (diff < minDiff) {
        minDiff = diff;
        bestIdx = idx;
      }
    });
    setCurrentIndex(bestIdx);
  };

  // 動画枠をタップして再生/一時停止
  const togglePlay = (index: number) => {
    const el = videoRefs.current[index]?.querySelector("video") as HTMLVideoElement;
    if (!el) return;
    if (el.paused) {
      el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  // ミュート切替
  const toggleMute = () => {
    setMuted((m) => !m);
    videoRefs.current.forEach((wrap) => {
      const v = wrap?.querySelector("video") as HTMLVideoElement;
      if (v) v.muted = !muted;
    });
  };

  // インジケーターで上下にスクロール
  const goTo = (idx: number) => {
    const el = videoRefs.current[idx];
    if (el && containerRef.current) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrentIndex(idx);
    }
  };

  if (videos.length === 0) {
    return (
      <div className="text-center text-gray-600 py-20">動画を読み込み中…</div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`
        w-full min-h-screen
        overflow-y-scroll
        snap-y snap-mandatory
        bg-gradient-to-b from-[#f8f9fa] via-[#eaecef] to-[#f2f4f7]
        flex flex-col items-center
        pb-16 pt-4
        relative
      `}
      style={{
        scrollSnapType: "y mandatory",
        overscrollBehaviorY: "contain",
      }}
      onScroll={handleScroll}
    >
      {videos.map((v, index) => {
        const isPC = typeof window !== "undefined" && window.innerWidth >= 1024;
        return (
          <div
            key={v.id}
            ref={el => { videoRefs.current[index] = el; }}
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
            {/* 動画本体 */}
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
                    maxHeight: isPC ? "70vh" : "calc(100vh - 100px)",
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
            {/* タイトル */}
            <div className="w-full text-center mt-4 mb-4">
              <div className="text-lg font-extrabold drop-shadow-md">{v.title}</div>
            </div>
            {/* インジケーター：下（次へ） */}
            {videos.length > 1 && index < videos.length - 1 && (
              <button
                className={`
                  absolute bottom-4 left-1/2 -translate-x-1/2 z-20
                  bg-gradient-to-r from-[#ffd700] to-[#f70031]
                  text-white font-bold rounded-full px-6 py-2 shadow-lg
                  animate-bounce
                  hover:scale-105 transition-all
                `}
                onClick={() => goTo(index + 1)}
              >
                ↓ 次の動画
              </button>
            )}
            {/* インジケーター：上（前へ） */}
            {videos.length > 1 && index > 0 && (
              <button
                className={`
                  absolute top-4 left-1/2 -translate-x-1/2 z-20
                  bg-gradient-to-r from-[#ffd700] to-[#f70031]
                  text-white font-bold rounded-full px-6 py-2 shadow-lg
                  animate-bounce
                  hover:scale-105 transition-all
                `}
                onClick={() => goTo(index - 1)}
              >
                ↑ 前の動画
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
