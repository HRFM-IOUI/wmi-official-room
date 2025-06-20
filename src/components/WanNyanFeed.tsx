"use client";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import VideoComments from "./VideoComments";

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
  const [liked, setLiked] = useState<{ [id: string]: boolean }>({});
  const [muted, setMuted] = useState(true);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("likedVideos");
    setLiked(raw ? JSON.parse(raw) : {});
  }, []);

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

  // 先頭動画は強制再生
  useEffect(() => {
    if (videos.length > 0 && videoRefs.current[0]) {
      videoRefs.current[0]!.play();
    }
  }, [videos]);

  const handleLike = async (id: string) => {
    if (liked[id]) return;
    await updateDoc(doc(db, "wannyanVideos", id), { likes: increment(1) });
    setVideos((vs) =>
      vs.map((v) => (v.id === id ? { ...v, likes: v.likes + 1 } : v))
    );
    const newLiked = { ...liked, [id]: true };
    setLiked(newLiked);
    localStorage.setItem("likedVideos", JSON.stringify(newLiked));
  };

  const togglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    setMuted((m) => !m);
    videoRefs.current.forEach((v) => {
      if (v) v.muted = !muted;
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("リンクをコピーしました！");
    } catch {
      alert("コピーに失敗しました");
    }
  };

  if (videos.length === 0) {
    return (
      <div className="text-center text-gray-600 py-20">動画を読み込み中…</div>
    );
  }

  return (
    <section className="lg:hidden h-screen overflow-y-scroll snap-y snap-mandatory bg-gradient-to-b from-[#f8f9fa] via-[#eaecef] to-[#f2f4f7] pb-16 pt-4">
      {videos.map((v, index) => (
        <div
          key={v.id}
          id={v.id}
          className="snap-start h-screen w-full flex flex-col justify-center items-center relative bg-black text-white transition-all duration-300 py-8"
          style={{ margin: "40px 0" }}
        >
          {/* ドラッグハンドル */}
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3 bg-gray-200 rounded-full opacity-70 z-30 cursor-grab active:opacity-100"
            style={{ touchAction: "none" }}
            title="スクロールできます"
          />

          {/* 動画本体 */}
          <div className="absolute inset-0 z-0" style={{ cursor: "pointer" }}>
            {v.type === "firestore" ? (
              <>
                <video
                  ref={(el): void => {
                    videoRefs.current[index] = el;
                  }}
                  src={v.url}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted={muted}
                  loop
                  playsInline
                  controls
                  onError={e => {
                    alert("動画の再生に失敗しました: " + v.url);
                    console.error("VIDEO ERROR:", e, v.url, v);
                  }}
                  onLoadedData={() => {
                    // 動画ロード成功
                  }}
                />
                {/* カスタムコントロールを重ねて配置（例：右下にミュート切替・再生トグル等） */}
                <div
                  className="absolute bottom-28 right-6 z-20 flex flex-col gap-3 items-end animate-fadeIn"
                  style={{ pointerEvents: "auto" }}
                >
                  <button
                    onClick={e => { e.stopPropagation(); toggleMute(); }}
                    className="bg-[#f70031] text-white px-3 py-2 rounded-full text-sm font-bold hover:bg-[#ffd700] transition"
                  >
                    {muted ? "🔇" : "🔊"}
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); togglePlay(index); }}
                    className="bg-[#f70031] text-white px-3 py-2 rounded-full text-sm font-bold hover:bg-[#ffd700] transition"
                  >
                    ▶️/⏸
                  </button>
                </div>
              </>
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${v.url}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${v.url}`}
                title={v.title}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* タイトル・いいね */}
          <div className="absolute bottom-20 left-4 z-10 text-white space-y-2">
            <div className="text-lg font-bold">{v.title}</div>
            <button
              onClick={() => handleLike(v.id)}
              disabled={!!liked[v.id]}
              className="text-[#f70031] text-2xl font-extrabold hover:text-[#ffd700] transition-all"
            >
              ♥ {v.likes}
            </button>
          </div>

          {/* コメント欄 */}
          <div className="absolute bottom-4 left-0 right-0 px-4 z-10">
            <VideoComments videoId={v.id} />
          </div>
        </div>
      ))}
    </section>
  );
}
