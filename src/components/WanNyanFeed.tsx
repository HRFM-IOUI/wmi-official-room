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
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

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
      setPlayingIndex(index);
    } else {
      video.pause();
      setPlayingIndex(null);
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
    <section
      className="
        lg:hidden
        h-screen
        overflow-y-scroll
        snap-y snap-mandatory
        bg-gradient-to-b from-[#f8f9fa] via-[#eaecef] to-[#f2f4f7]
        pb-16 pt-4
      "
      style={{
        scrollSnapType: "y mandatory",
        overscrollBehaviorY: "contain",
      }}
    >
      {videos.map((v, index) => {
        // フロートボタンを再生中インデックスのみ表示
        const isActive = playingIndex === index;

        // シェアリンク
        const currentUrl = typeof window !== "undefined"
          ? `${window.location.origin}/#${v.id}` : "";
        const twitterShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(v.title)}&url=${encodeURIComponent(currentUrl)}`;
        const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        const lineShare = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(currentUrl)}`;

        return (
          <div
            key={v.id}
            id={v.id}
            className="
              snap-start h-screen w-full flex flex-col justify-center items-center
              relative bg-black text-white
              transition-all duration-300
              py-8
            "
            style={{ margin: "40px 0" }} // 上下マージン追加
          >
            {/* --- ドラッグ用ハンドル --- */}
            <div
              className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3 bg-gray-200 rounded-full opacity-70 z-30 cursor-grab active:opacity-100"
              style={{ touchAction: "none" }}
              title="スクロールできます"
            />

            {/* --- 動画本体 --- */}
            <div
              className="absolute inset-0 z-0"
              onClick={() => togglePlay(index)}
              style={{ cursor: "pointer" }}
            >
              {v.type === "firestore" ? (
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
                  onPlay={() => setPlayingIndex(index)}
                  onPause={() => setPlayingIndex(null)}
                  controls={false} // UIは自作
                />
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

            {/* --- フロートコントロール（再生中のみ表示） --- */}
            {isActive && v.type === "firestore" && (
              <div
                className="
                  absolute bottom-28 right-6 z-10 flex flex-col gap-3 items-end
                  animate-fadeIn
                "
                style={{ pointerEvents: "auto" }}
              >
                <button
                  onClick={toggleMute}
                  className="bg-[#f70031] text-white px-3 py-2 rounded-full text-sm font-bold hover:bg-[#ffd700] transition"
                >
                  {muted ? "🔇" : "🔊"}
                </button>
                <button
                  onClick={() => togglePlay(index)}
                  className="bg-[#f70031] text-white px-3 py-2 rounded-full text-sm font-bold hover:bg-[#ffd700] transition"
                >
                  {isActive ? "⏸" : "▶️"}
                </button>
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    onClick={handleCopy}
                    className="bg-[#f70031] text-white px-3 py-1 rounded-full text-xs hover:bg-[#ffd700] transition"
                  >
                    📋 Copy
                  </button>
                  <a
                    href={twitterShare}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#f70031] text-white px-3 py-1 rounded-full text-xs hover:bg-[#ffd700] transition"
                  >
                    🐦 Twitter
                  </a>
                  <a
                    href={facebookShare}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#f70031] text-white px-3 py-1 rounded-full text-xs hover:bg-[#ffd700] transition"
                  >
                    📘 Facebook
                  </a>
                  <a
                    href={lineShare}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#f70031] text-white px-3 py-1 rounded-full text-xs hover:bg-[#ffd700] transition"
                  >
                    📲 LINE
                  </a>
                </div>
              </div>
            )}

            {/* --- タイトル・いいね --- */}
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

            {/* --- コメント欄 --- */}
            <div className="absolute bottom-4 left-0 right-0 px-4 z-10">
              <VideoComments videoId={v.id} />
            </div>
          </div>
        );
      })}
    </section>
  );
}
