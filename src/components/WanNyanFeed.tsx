"use client";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

type WanNyanVideo = {
  id: string;
  type: "youtube" | "firestore";
  url: string;
  title: string;
  likes: number;
  comments: number;
};

export default function WanNyanFeed() {
  const [videos, setVideos] = useState<WanNyanVideo[]>([]);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

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

  // 描画後に最初の動画を安全に再生
  useEffect(() => {
    if (videos.length > 0 && videoRefs.current[0]) {
      setTimeout(() => {
        videoRefs.current[0]?.play().catch(() => {});
      }, 0);
      setPlaying(true);
    }
  }, [videos]);

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
      <div style={{ color: '#c00', background: '#fff', padding: 4, fontSize: 11 }}>
        <b>動画件数: {videos.length}</b>
      </div>
      {videos.map((v, index) => {
        const videoSrc = v.type === "firestore"
          ? v.url
          : `https://www.youtube.com/embed/${v.url}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${v.url}`;

        return (
          <div
            key={v.id}
            id={v.id}
            className="snap-start w-full flex flex-col justify-center items-center relative bg-black bg-opacity-80"
            style={{
              height: "calc(100vh - 100px)",
              padding: "36px 0", // 上下余白
            }}
          >
            {/* --- 動画外枠 --- */}
            <div
              className="
                w-[94vw] max-w-lg aspect-video rounded-2xl shadow-xl bg-black border-4 border-[#fff3] flex items-center justify-center
                relative
              "
              style={{ margin: "0 auto" }}
              onClick={() => togglePlay(index)}
            >
              {v.type === "firestore" ? (
                <video
                  ref={el => { videoRefs.current[index] = el; }}
                  src={videoSrc}
                  className="w-full h-full object-cover rounded-2xl"
                  autoPlay
                  muted={muted}
                  loop
                  playsInline
                  controls
                  onError={e => alert("動画の再生に失敗しました: " + videoSrc)}
                />
              ) : (
                <iframe
                  src={videoSrc}
                  title={v.title}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="w-full h-full object-cover rounded-2xl"
                />
              )}
            </div>
            {/* --- タイトル --- */}
            <div className="mt-4 text-lg font-bold text-white drop-shadow">{v.title}</div>
          </div>
        );
      })}
    </section>
  );
}
