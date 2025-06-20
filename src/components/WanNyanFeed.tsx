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

  // 描画後に安全に再生
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
      <div style={{color: '#c00', background: '#fff', padding: 4, fontSize: 11}}>
        <b>動画件数: {videos.length}</b>
        <pre style={{whiteSpace:'pre-wrap',fontSize:10}}>{JSON.stringify(videos, null, 2)}</pre>
      </div>
      {videos.map((v, index) => {
        const videoSrc = v.type === "firestore"
          ? v.url
          : `https://www.youtube.com/embed/${v.url}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${v.url}`;

        return (
          <div
            key={v.id}
            id={v.id}
            className="snap-start w-full flex flex-col justify-center items-center relative bg-black text-white"
            style={{ height: "calc(100vh - 64px)" }} // ← 高さを1.6cm短く
          >
            {/* --- 動画本体 --- */}
            <div
              className="absolute inset-0 z-0"
              onClick={() => togglePlay(index)}
              style={{ height: "100%" }}
            >
              {index === 0 && (
                <button
                  style={{
                    position: "absolute", top: 8, left: 8, zIndex: 99, fontSize: 12, padding: 2,
                    background: "#ff0", color: "#222", border: "1px solid #999", borderRadius: 5
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    alert("サンプル動画で強制テスト！");
                    window.open("https://www.w3schools.com/html/mov_bbb.mp4");
                  }}
                >[サンプル動画URLを開く]</button>
              )}
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
                  onError={e => {
                    alert("動画の再生に失敗しました: " + videoSrc);
                  }}
                  style={{ height: "100%" }}
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
