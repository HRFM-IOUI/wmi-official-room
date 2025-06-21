"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/autoplay";
import Image from "next/image";

// カードデータ例
const gridCards = [
  { id: 1, title: "Development Footage", type: "video", src: "/wmifuture01.mp4" },
  { id: 2, title: "Development Footage", type: "video", src: "/genkou.mp4" },
  { id: 3, title: "Development Footage", type: "gif", src: "/MobileCatUI.gif" },
  { id: 4, title: "Development Footage", type: "gif", src: "/dashboard.gif" },
  { id: 5, title: "Development Footage", type: "gif", src: "/roomchat.gif" },
  // 必要に繰り返し増やせます
];

export default function GridCarousel() {
  return (
    <div className="mt-10 w-full max-w-5xl mx-auto">
      <Swiper
        modules={[Autoplay, FreeMode]}
        spaceBetween={24}
        slidesPerView={2}
        loop={true}
        freeMode={true}
        speed={5000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          900: { slidesPerView: 3 },
          1200: { slidesPerView: 4 },
          1536: { slidesPerView: 5 },
        }}
        allowTouchMove={true}
        className="!overflow-visible"
        style={{ cursor: "grab", padding: "1.4rem 0" }}
      >
        {gridCards.map((card) => (
          <SwiperSlide
            key={card.id}
            className="flex flex-col items-center card-glass mx-2 flex-shrink-0"
            style={{ 
              // スマホ: 160, PC: 210
              height: 'clamp(160px, 19vw, 210px)', 
              minWidth: 140, 
              maxWidth: 220 
            }}
          >
            {/* 画像・GIF・動画 対応 */}
            {card.type === "image" && (
              <Image
                src={card.src}
                alt={card.title}
                width={168}
                height={168}
                className="rounded-xl object-cover mb-3"
                draggable={false}
                unoptimized
              />
            )}
            {card.type === "gif" && (
              <img
                src={card.src}
                alt={card.title}
                width={168}
                height={168}
                className="rounded-xl object-cover mb-3"
                draggable={false}
                style={{ aspectRatio: "1/1" }}
              />
            )}
            {card.type === "video" && (
              <video
                src={card.src}
                width={168}
                height={168}
                className="rounded-xl object-cover mb-2"
                style={{
                  background: "#111", 
                  aspectRatio: "1/1", 
                  maxHeight: "160px", // スマホ向け
                  maxWidth: "100%", 
                  minHeight: "90px",
                }}
                controls={false}
                autoPlay
                muted
                loop
                playsInline
                draggable={false}
                preload="metadata"
              />
            )}
            <span className="block text-xs text-slate-500 text-center mt-0.5 px-1 italic leading-tight">
              {card.type === "video" }
            </span>
            {card.title && (
              <span className="text-sm font-semibold text-slate-800 text-center mt-1">{card.title}</span>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
