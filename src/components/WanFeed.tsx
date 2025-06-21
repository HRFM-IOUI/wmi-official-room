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
      className="
        w-full min-h-screen
        overflow-y-scroll snap-y snap-mandatory
        bg-gradient-to-b from-[#f8f9fa] via-[#eaecef] to-[#f2f4f7]
        flex flex-col items-center
        pb-16 pt-4
      "
      style={{
        scrollSnapType: "y mandatory",
        overscrollBehaviorY: "contain",
      }}
    >
      {videos.map((v, index) => (
        <div
          key={v.id}
          id={v.id}
          className="
            snap-start w-full flex flex-col justify-center items-center relative
            bg-black bg-opacity-80
          "
          style={{
            height: "calc(100vh - 100px)",
            padding: "36px 0", // 上下余白
          }}
        >
          {/* --- 動画外枠 --- */}
          <div
            className="
              w-[94vw] max-w-lg aspect-video rounded-2xl shadow-xl
              flex items-center justify-center relative border-4 border-[#fff5]
              "
            style={{
              margin: "0 auto",
              background: "linear-gradient(120deg,#f70031cc 0%,#ffd700bb 100%)",
              boxShadow: "0 6px 32px #f7003166, 0 1.5px 4px #ffd70066",
            }}
            onClick={() => togglePlay(index)}
          >
            {v.type === "firestore" ? (
              <video
                ref={el => { videoRefs.current[index] = el; }}
                src={v.url}
                className="w-full h-full object-contain rounded-2xl bg-black"
                autoPlay
                muted={muted}
                loop
                playsInline
                controls
                onError={e => alert("動画の再生に失敗しました")}
                style={{
                  background: "#000d",
                  maxHeight: "70vh",
                }}
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
          <div className="mt-4 text-lg font-bold text-white drop-shadow">{v.title}</div>
        </div>
      ))}
    </section>
  );
}
