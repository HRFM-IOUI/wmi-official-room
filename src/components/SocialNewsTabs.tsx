"use client";
import { useState } from "react";
import { FaXTwitter } from "react-icons/fa6"; // X公式アイコン

const TABS = ["Social Media", "Announcements", "Events"];

export default function SocialNewsTabs() {
  const [active, setActive] = useState(0);

  return (
    <section
      className="
        w-full py-7 sm:py-10
        bg-gradient-to-b from-[#f5f6f8] via-[#e1e5e8] to-[#edeffc]/80
        border-t border-primary/10 shadow-inner
        transition-all
      "
    >
      <div className="max-w-4xl mx-auto">
        {/* Tab Buttons */}
        <div className="flex mb-5 sm:mb-6 space-x-3 sm:space-x-4 justify-center">
          {TABS.map((tab, i) => (
            <button
              key={i}
              className={`px-4 sm:px-6 py-2 rounded-full font-semibold transition duration-200
                ${active === i
                  ? "bg-gradient-to-r from-[#f70031] to-[#ffd700] text-white shadow-lg scale-105"
                  : "bg-white text-[#f70031] border border-[#f70031]/20 hover:bg-[#f8f8fd] hover:scale-105"}`}
              onClick={() => setActive(i)}
              style={{
                boxShadow: active === i ? "0 4px 16px rgba(162,0,32,0.09)" : undefined,
                fontSize: "0.96rem",
              }}
              aria-label={`Switch to ${tab}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {active === 0 && (
            <div className="flex flex-col items-center justify-center">
              {/* Xカードのみ */}
              <div
                className="bg-white/90 shadow-2xl rounded-2xl p-8 flex flex-col items-center
                border border-[#f5f5f9] hover:scale-105 transition group
                max-w-xs mx-auto"
                style={{
                  boxShadow: "0 6px 32px #0004, 0 1.5px 4px #f7003133",
                }}
              >
                <span className="mb-4 flex items-center gap-2">
                  <FaXTwitter className="text-3xl text-[#1cb5e0] group-hover:scale-110 transition" />
                  <span className="font-extrabold text-lg text-[#192349] tracking-wide">
                    X (formerly Twitter)
                  </span>
                </span>
                <a
                  href="https://x.com/wondermetanism?s=21" // ←ご自身のXアカウントURLに変更！
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-6 py-2 rounded-full font-bold text-white bg-gradient-to-r from-[#1cb5e0] to-[#000851] shadow hover:scale-105 transition"
                  style={{ letterSpacing: "0.04em" }}
                >
                  View X Timeline
                </a>
              </div>
            </div>
          )}

          {active === 1 && (
  <div className="space-y-5">
    {/* Announcement Card */}
    <div className="bg-gradient-to-r from-[#fff7f7] via-white to-[#f7f9ff] border-l-8 border-[#f70031] p-6 rounded-xl shadow hover:scale-105 transition">
      <div className="font-bold text-[#f70031] mb-1">Important Notice</div>
      <div className="text-slate-800">
        {/* ここに内容 */}
        Welcome to the official news hub for R∞M. Here you’ll find updates on upcoming releases, technical improvements, and insights from the development team.
      </div>
    </div>
  </div>
)}


          {active === 2 && (
  <div className="space-y-5">
    {/* Event Card */}
    <div className="bg-gradient-to-r from-[#edeffc] via-white to-[#fff7f7] border-l-8 border-[#f70031] p-6 rounded-xl shadow hover:scale-105 transition">
      <div className="font-bold text-[#f70031] mb-1">Upcoming Events</div>
      きっと役に立てると思います。
誰かの役に立てる、そんなイベント・発表をお楽しみに！！
<br />
<span className="text-xs text-gray-500">
  We hope our events and updates will help someone, somewhere in the world. Stay tuned!
</span>
    </div>
  </div>
)}

        </div>
      </div>
    </section>
  );
}
