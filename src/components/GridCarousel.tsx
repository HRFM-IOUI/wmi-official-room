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
  { id: 3, title: "أهلاً وسهلاً/شكراً", type: "gif", src: "/catui.mp4" },
  { id: 4, title: "	환영합니다/	감사합니다", type: "image", src: "/demo7.mp4" },
  { id: 5, title: "Hoş geldiniz/Teşekkür ederim", type: "gif", src: "/demo6.mp4" },
  { id: 6, title: "	欢迎/	谢谢", type: "gif", src: "/demo5.mp4" },
  { id: 7, title: "	स्वागत है/धन्यवाद", type: "gif", src: "/20250406_064356837_iOS.png" },
  { id: 8, title: "	Bienvenido/Gracias", type: "gif", src: "/20250406_064053356_iOS.png" },
  { id: 9, title: "	Bem-vindo/Obrigado", type: "gif", src: "/20250101_154551003_iOS.jpg" },
  { id: 10, title: "Selamat datang/Terima kasih", type: "gif", src: "/wmithema.png" },
  { id: 11, title: "Willkommen/Danke", type: "gif", src: "/WMI-logo.png" },
  { id: 12, title: "Добро пожаловать/Спасибо", type: "gif", src: "/wmLOGO.png" },

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
