"use client";
import React, { useRef } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

type WanNyanVideo = {
  id: string;
  type: "youtube" | "firestore";
  url: string;
  title: string;
};

export default function WanFeed() {
  const [videos, setVideos] = useState<WanNyanVideo[]>([]);

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

  if (videos.length === 0) {
    return (
      <div className="text-center text-gray-600 py-20">動画を読み込み中…</div>
    );
  }

  return (
    <section
      className="
        w-full min-h-screen overflow-y-scroll
        snap-y snap-mandatory
        bg-gradient-to-b from-[#f8f9fa] via-[#eaecef] to-[#f2f4f7]
        flex flex-col items-center pb-16 pt-4
      "
      style={{
        scrollSnapType: "y mandatory",
        overscrollBehaviorY: "contain",
      }}
    >
      {videos.map((v, idx) => (
        <VideoBlock key={v.id} v={v} />
      ))}
    </section>
  );
}

// ▼1ブロックごと
function VideoBlock({ v }: { v: WanNyanVideo }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Intersection Observer
  const { ref, inView } = useInView({
    threshold: 0.6, // 60%見えてたら再生
    triggerOnce: false,
  });

  // 見えてたら再生、外れたら一時停止
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (inView) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  }, [inView]);

  return (
    <div
      ref={ref}
      className="
        snap-start w-full flex flex-col justify-center items-center relative
        bg-black bg-opacity-80
      "
      style={{
        height: "calc(100vh - 100px)",
        padding: "36px 0",
      }}
    >
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
      >
        {v.type === "firestore" ? (
          <video
            ref={videoRef}
            src={v.url}
            className="w-full h-full object-contain rounded-2xl bg-black"
            loop
            muted
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
            src={`https://www.youtube.com/embed/${v.url}?autoplay=1&mute=1&loop=1&playlist=${v.url}`}
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
      <div className="mt-4 text-lg font-bold text-white drop-shadow">{v.title}</div>
    </div>
  );
}
