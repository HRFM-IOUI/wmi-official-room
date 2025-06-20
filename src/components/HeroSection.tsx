"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";

const GridCarousel = dynamic(() => import("./GridCarousel"), { ssr: false });

// 4ピースの情報
const PIECES = [
  {
    key: "tl",
    style: { top: 0, left: 0 },
    initial: { x: "-160%", y: "-160%" },
    animate: { x: 0, y: 0 },
  },
  {
    key: "tr",
    style: { top: 0, left: "50%" },
    initial: { x: "160%", y: "-160%" },
    animate: { x: 0, y: 0 },
  },
  {
    key: "bl",
    style: { top: "50%", left: 0 },
    initial: { x: "-160%", y: "160%" },
    animate: { x: 0, y: 0 },
  },
  {
    key: "br",
    style: { top: "50%", left: "50%" },
    initial: { x: "160%", y: "160%" },
    animate: { x: 0, y: 0 },
  },
];

export default function HeroSection({
  size = 320,
}: {
  size?: number;
}) {
  const [assembled, setAssembled] = useState(false);
  const [moveUp, setMoveUp] = useState(false);
  const [showMain, setShowMain] = useState(false);

  const [stage, setStage] = useState<"grid" | "none">("none");

  useEffect(() => {
    const timer = setTimeout(() => setAssembled(true), 1000);
    let moveTimer: NodeJS.Timeout | null = null;
    let mainTimer: NodeJS.Timeout | null = null;

    // ロゴ縮小移動アニメーションが始まるタイミングでHeroメッセージ・CTAボタンを表示
    if (assembled) {
      moveTimer = setTimeout(() => setMoveUp(true), 920); // 合体直後にmoveUp
      mainTimer = setTimeout(() => setShowMain(true), 920); // ロゴ縮小上昇開始から0.48秒でテキスト表示
      setTimeout(() => setStage("grid"), 2200); // メインテキスト後にグリッドカルーセル表示
    }

    return () => {
      clearTimeout(timer);
      if (moveTimer) clearTimeout(moveTimer);
      if (mainTimer) clearTimeout(mainTimer);
    };
  }, [assembled]);

  const getPieceProps = (key: string) => {
    if (key === "tl") {
      return { objectPosition: "left top", imgTop: 0 };
    }
    if (key === "tr") {
      return { objectPosition: "right top", imgTop: 0 };
    }
    if (key === "bl") {
      return { objectPosition: "left top", imgTop: -size / 2 };
    }
    if (key === "br") {
      return { objectPosition: "right top", imgTop: -size / 2 };
    }
    return { objectPosition: "center", imgTop: 0 };
  };

  const upY = -size * 0.5;
  const scaleTo = 0.35;

  return (
    <section
      style={{
        width: "100%",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background: "#ffffff",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ y: 0, scale: 1 }}
        animate={
          moveUp
            ? { y: upY, scale: scaleTo, transition: { duration: 0.9, ease: [0.2, 0.8, 0.2, 1] } }
            : { y: 0, scale: 1 }
        }
        style={{
          width: size,
          height: size,
          position: "absolute",
          top: 50,
          zIndex: 20,
        }}
      >
        {PIECES.map((piece) => {
          const { objectPosition, imgTop } = getPieceProps(piece.key);
          return (
            <motion.div
              key={piece.key}
              initial={piece.initial}
              animate={assembled ? piece.animate : piece.initial}
              transition={{
                duration: 1.0,
                type: "spring",
                bounce: 0.25,
                ease: [0.42, 0, 0.58, 1], // より滑らかに
              }}
              style={{
                position: "absolute",
                width: "50%",
                height: "50%",
                ...piece.style,
                overflow: "hidden",
              }}
            >
              <Image
                src="/wmLOGO.png"
                alt={`WM Logo ${piece.key}`}
                width={size}
                height={size}
                style={{
                  objectFit: "none",
                  width: size,
                  height: size,
                  objectPosition,
                  position: "absolute",
                  left: 0,
                  top: imgTop,
                  pointerEvents: "none",
                  userSelect: "none",
                  background: "#ffffff",
                }}
                draggable={false}
                priority
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* 2. Heroメインテキスト＆CTA */}
      {showMain && (
        <motion.div
          initial={{ opacity: 0, y: 56 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.0,
            delay: 0.2, // アニメーション遅延を長めに設定
            type: "spring",
            damping: 25,  // 減衰設定をやや強めに
            stiffness: 100, // バネの硬さを強くする
          }}
          className="flex flex-col items-center justify-center mt-32 text-center z-10"
        >
          <h1 className="text-[2.2rem] md:text-5xl font-extrabold text-[#222] mb-3 tracking-tight">
            A new world of <span className="text-[#f70031]">creation</span>
            <br /> One trusted platform.
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-xl">
            Empowering creators worldwide — all in one secure room.
          </p>
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.5,
              duration: 0.6,
              ease: [0.42, 0, 0.58, 1], // より滑らかに
            }}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-[#f70031] to-[#ffd700] text-white font-bold shadow-md hover:scale-105 active:scale-98 transition-all"
          >
            Try it free
          </motion.button>
        </motion.div>
      )}

      {/* --- GridCarousel --- */}
      <AnimatePresence>
        {stage === "grid" && (
          <motion.div
            key="hero-grid"
            initial={{ opacity: 0, y: 44, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 36, scale: 0.95 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="w-full flex justify-center mt-12 z-0"
          >
            <div className="w-full max-w-5xl px-2">
              <GridCarousel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
