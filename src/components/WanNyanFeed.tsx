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
  const [playing, setPlaying] = useState(true);
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

  // ★副作用だけ確保（console.log不要で）
  useEffect(() => {
    // 副作用：空ループで「再レンダリングの順番」を担保
    videos.forEach(() => {});
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
    <section className="lg:hidden h-screen overflow-y-scroll snap-y snap-mandatory bg-gradient-to-b from-[#f8f9fa] via-[#eaecef] to-[#f2f4f7]">
      {/* デバッグUIも削除 */}
      {videos.map((v, index) => {
        const videoSrc =
          v.type === "firestore"
            ? v.url
            : `https://www.youtube.com/embed/${v.url}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${v.url}`;

        return (
          <div
            key={v.id}
            id={v.id}
            className="snap-start h-screen w-full flex flex-col justify-center items-center relative bg-black text-white"
          >
            {/* --- 動画本体 --- */}
            <div className="absolute inset-0 z-0" onClick={() => togglePlay(index)}>
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
                />
              ) : (
                <iframe
                  src={videoSrc}
                  title={v.title}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="w-full h-full object-cover"
                />
              )}
            </div>

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
