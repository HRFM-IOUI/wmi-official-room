"use client";
import React from "react";

export default function Greeting() {
  return (
    <section
      className="w-full bg-gradient-to-r from-[#f8f9fa] via-[#e1e5e8] to-[#f3f4f6] py-8 sm:py-14 px-4 sm:px-6 flex justify-center border-b border-gray-200"
      aria-labelledby="greeting-heading"
      id="greeting"
    >
      <div className="max-w-3xl w-full">

        {/* --- Welcome note --- */}
        <div className="text-center text-sm sm:text-base text-gray-600 mb-6">
          Welcome to the official site of <strong>WonderMetanism Inc.</strong>, the creators behind <strong>R∞M</strong> — a creative platform built by one founder and AI.
        </div>

        {/* --- Heading --- */}
        <div className="mb-6 sm:mb-8">
          <h2
            id="greeting-heading"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#192349] drop-shadow-[0_3px_12px_rgba(25,35,73,0.18)] relative z-10"
            style={{ letterSpacing: "0.02em", textAlign: "right" }}
          >
            A Message from the Creator
          </h2>
          <div className="h-1 w-16 sm:w-24 mt-2 rounded-full bg-gradient-to-r from-[#f70031] via-[#ffd700] to-[#f70031] shadow-md" />
        </div>

        {/* --- Greeting Content --- */}
        <div className="space-y-5 sm:space-y-6 text-base sm:text-lg text-[#192349] leading-relaxed">
          <p>
            Thank you for stopping by. I’m{" "}
            <span className="font-bold text-[#f70031]">HiRO</span>, founder of WonderMetanism Inc.—and the one who built this platform, R∞M.
          </p>
          <p>
            This project isn’t just a product. It’s my reply to the world. A world where creativity is often trapped by systems, borders, or fear.
          </p>
          <p>
            R∞M is our answer—a space where anyone, anywhere, can publish, express, and connect. Built from the ground up with independence in mind, it serves creators in{" "}
            <strong className="font-semibold text-[#f1c40f]">education, publishing, art, and media</strong>.
          </p>
          <p>
            No investors. No safety net. Just hope, code, and conviction. Every line you read here was written in a time of scarcity—but also clarity.
          </p>
          <p>
            If you feel even a flicker of what we feel—welcome. This space is yours too.
          </p>
          <div className="text-right mt-8 sm:mt-10">
            <p className="text-sm sm:text-base text-gray-600">Founder &amp; CEO</p>
            <p className="text-lg sm:text-2xl font-bold text-[#192349] mt-1">HiRO</p>
            <p className="text-sm text-gray-500 mt-1">WonderMetanism Inc.</p>
          </div>
        </div>

        {/* 画像を使う場合のサンプル
        <img
          src="/creator.jpg"
          alt="HiRO, Founder of WonderMetanism Inc."
          className="mt-8 rounded-full mx-auto w-20 h-20 object-cover shadow"
        />
        */}
      </div>
    </section>
  );
}
