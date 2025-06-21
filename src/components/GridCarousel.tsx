"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/autoplay";
import Image from "next/image";

// カードデータ例（自由に増減OK）
const gridCards = [
  { id: 1, title: "ようこそ/ありがとう", type: "video", src: "/wmifuture01.mp4" },
  { id: 2, title: "Welcome/Thank you", type: "image", src: "/fixstarttiming.mp4" },


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
            style={{ height: 210, minWidth: 148, maxWidth: 200 }}
          >
            {/* 画像・GIF・動画 対応 */}
            {card.type === "image" && (
              <Image
                src={card.src}
                alt={card.title}
                width={88}
                height={88}
                className="rounded-xl object-cover mb-3"
                draggable={false}
                unoptimized
              />
            )}
            {card.type === "gif" && (
              <img
                src={card.src}
                alt={card.title}
                width={88}
                height={88}
                className="rounded-xl object-cover mb-3"
                draggable={false}
                style={{ aspectRatio: "1/1" }}
              />
            )}
            {card.type === "video" && (
              <video
                src={card.src}
                width={88}
                height={88}
                className="rounded-xl object-cover mb-3"
                style={{ background: "#111", aspectRatio: "1/1" }}
                controls={false}
                autoPlay
                muted
                loop
                playsInline
                draggable={false}
              />
            )}
            <span className="text-sm font-semibold text-slate-800 text-center">{card.title}</span>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
