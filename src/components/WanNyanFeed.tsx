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

  // 再生トリガー: 初回ロード時＋ユーザー操作時
  useEffect(() => {
    let tried = false;
    function tryPlayFirstVideo() {
      const v = videoRefs.current[0];
      if (v) {
        v.play().then(() => setPlaying(true)).catch(() => {});
      }
    }
    // 初回ロード時は遅延＋try
    const t = setTimeout(() => {
      tryPlayFirstVideo();
      tried = true;
    }, 250);

    // "once: true" なし。コールバック内でremoveEventListenerすることで一度だけ発火。
    const userActionPlay = () => {
      if (!tried) {
        tryPlayFirstVideo();
        tried = true;
      }
      window.removeEventListener("touchstart", userActionPlay);
      window.removeEventListener("scroll", userActionPlay);
    };
    window.addEventListener("touchstart", userActionPlay);
    window.addEventListener("scroll", userActionPlay);

    return () => {
      clearTimeout(t);
      window.removeEventListener("touchstart", userActionPlay);
      window.removeEventListener("scroll", userActionPlay);
    };
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
    <section className="lg:hidden h-screen overflow-y-scroll snap-y snap-mandatory bg-gradient-to-b from-[#f8f9fa] via-[#eaecef] to-[#f2f4f7]">
      {videos.map((v, index) => {
        const videoSrc = v.type === "firestore"
          ? v.url
          : `https://www.youtube.com/embed/${v.url}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${v.url}`;

        return (
          <div
            key={v.id}
            id={v.id}
            className="snap-start w-full flex flex-col justify-center items-center relative bg-black/90 text-white"
            style={{ height: "calc(100vh - 48px)", borderRadius: 22, margin: "20px 0" }}
          >
            {/* --- 動画本体 --- */}
            <div
              className="absolute inset-0 z-0"
              onClick={() => togglePlay(index)}
              style={{ height: "100%" }}
            >
              {v.type === "firestore" ? (
                <video
                  ref={(el): void => {
                    videoRefs.current[index] = el;
                  }}
                  src={videoSrc}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted={muted}
                  loop
                  playsInline
                  controls
                  style={{ height: "100%", background: "#111" }}
                  onError={e => {
                    alert("動画の再生に失敗しました: " + videoSrc);
                  }}
                />
              ) : (
                <iframe
                  src={videoSrc}
                  title={v.title}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="w-full h-full object-cover"
                  style={{ height: "100%" }}
                />
              )}
            </div>
            {/* --- タイトル --- */}
            <div className="absolute bottom-20 left-4 z-10 text-white space-y-2">
              <div className="text-lg font-bold">{v.title}</div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
