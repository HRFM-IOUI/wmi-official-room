"use client";
import { useState } from "react";

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Social Media Cards */}
              {["X (formerly Twitter)", "Facebook", "YouTube"].map((social, index) => (
                <div
                  key={index}
                  className="bg-white shadow-xl rounded-xl p-5 flex flex-col items-center hover:scale-105 transition"
                >
                  <span className="font-bold text-[#f70031] mb-3">{social}</span>
                  <a
                    href={`https://${social.toLowerCase().replace(" (formerly twitter)", "").replace(" ", "")}.com/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ffd700] font-semibold hover:underline"
                  >
                    View Official Timeline
                  </a>
                </div>
              ))}
            </div>
          )}

          {active === 1 && (
            <div className="space-y-5">
              {/* Announcement Card */}
              <div className="bg-gradient-to-r from-[#fff7f7] via-white to-[#f7f9ff] border-l-8 border-[#f70031] p-6 rounded-xl shadow hover:scale-105 transition">
                <div className="font-bold text-[#f70031] mb-1">Important Notice</div>
                <div>
                  Stay up to date with our latest updates, platform news, and development insights.
                </div>
              </div>
            </div>
          )}

          {active === 2 && (
            <div className="space-y-5">
              {/* Event Card */}
              <div className="bg-gradient-to-r from-[#edeffc] via-white to-[#fff7f7] border-l-8 border-[#f70031] p-6 rounded-xl shadow hover:scale-105 transition">
                <div className="font-bold text-[#f70031] mb-1">Upcoming Events</div>
                <div>
                  Find detailed information about upcoming sessions, workshops, and community activities.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
