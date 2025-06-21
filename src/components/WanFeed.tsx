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

  // 各動画を画面内に入ったら自動再生（Intersection Observerでガチ再現も可！）
  useEffect(() => {
    videos.forEach((_, idx) => {
      const v = videoRefs.current[idx];
      if (v) v.muted = muted;
    });
  }, [videos, muted]);

  if (videos.length === 0) {
    return (
      <div className="text-center text-gray-600 py-20 h-screen flex items-center justify-center">
        動画を読み込み中…
      </div>
    );
  }

  return (
    <section
      className="w-full h-screen overflow-y-scroll snap-y snap-mandatory bg-black"
      style={{
        scrollSnapType: "y mandatory",
        overscrollBehaviorY: "contain",
      }}
    >
      {videos.map((v, index) => (
        <div
          key={v.id}
          className="snap-start w-full h-screen flex flex-col justify-center items-center relative"
          style={{
            background: "#000",
          }}
        >
          <div
            className="absolute inset-0 z-0 flex items-center justify-center"
            onClick={() => {
              const video = videoRefs.current[index];
              if (video?.paused) video.play();
              else video?.pause();
            }}
          >
            {v.type === "firestore" ? (
              <video
                ref={el => { videoRefs.current[index] = el; }}
                src={v.url}
                className="w-full h-full object-cover"
                autoPlay
                muted={muted}
                loop
                playsInline
                controls
                style={{ background: "#000" }}
              />
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${v.url}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${v.url}`}
                title={v.title}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full object-cover"
                style={{ background: "#000" }}
              />
            )}
          </div>
          {/* タイトルを下部に表示 */}
          <div className="absolute bottom-12 left-0 w-full text-center z-10">
            <span className="text-lg font-bold text-white drop-shadow">{v.title}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
