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
      // ★ 取得できているか
      console.log("取得動画リスト", items);
    };
    fetchVideos();
  }, []);

  // ★ 描画直前にも配列ログ
  console.log("描画直前: videos", videos);

  // --- 関数定義はここでまとめて ---
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
      {/* ★ 全体map直前にも */}
      <div style={{color: '#c00', background: '#fff', padding: 4, fontSize: 11}}>
        <b>動画件数: {videos.length}</b>
        <pre style={{whiteSpace:'pre-wrap',fontSize:10}}>{JSON.stringify(videos, null, 2)}</pre>
      </div>
      {videos.map((v, index) => {
        // ★ map内で必ずkeyやtype、urlを出す！
        console.log("描画中: index", index, "id", v.id, "type", v.type, "url", v.url, typeof v.url);

        if (!v.url || typeof v.url !== "string") {
          console.warn("動画URL異常値検出！", v);
        }
        const videoSrc = v.type === "firestore"
          ? v.url
          : `https://www.youtube.com/embed/${v.url}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${v.url}`;

        return (
          <div
            key={v.id}
            id={v.id}
            className="snap-start h-screen w-full flex flex-col justify-center items-center relative bg-black text-white"
          >
            {/* --- 動画本体 --- */}
            <div
              className="absolute inset-0 z-0"
              onClick={() => togglePlay(index)}
            >
              {/* ★仮の外部動画リンクボタン */}
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
                <>
                  {/* ★今使っているsrc値を画面右下に表示 */}
                  <div style={{position:"absolute", bottom:8, right:8, color:"#0f0", fontSize:10, zIndex:88, background:'#111b', padding:'2px 6px', borderRadius:6}}>
                    {videoSrc}
                  </div>
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
                      console.error("VIDEO ERROR:", e, videoSrc, v);
                    }}
                    onLoadedData={() => {
                      console.log("動画読み込み成功", videoSrc, v);
                    }}
                  />
                </>
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
