"use client";
import Link from "next/link";

export default function AboutPage() {
  // トップページのフッターに遷移＆ジャンプ
  const scrollToTopFooter = () => {
    window.location.href = "/#site-footer";
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      {/* --- Top Back Link --- */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-block text-sm text-[#f70031] hover:underline font-semibold transition"
          aria-label="Back to Home"
        >
          ← Back to Top
        </Link>
      </div>

      {/* --- Main Heading --- */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#192349] mb-5 tracking-tight drop-shadow-[0_2px_10px_rgba(25,35,73,0.13)]">
        About WonderMetanism Inc. &amp; R∞M
      </h1>

      {/* --- Lead Paragraph --- */}
      <div className="mb-8 text-base sm:text-lg text-gray-700 leading-relaxed bg-gradient-to-r from-[#faf6f8] via-[#eef3fb] to-[#faf8ed] rounded-xl px-4 py-5 shadow-sm">
        WonderMetanism Inc. (ワンダーメタニズム株式会社) is a Tokyo-based company founded and operated by HiRO, together with advanced AI.  
        <br />
        <strong>R∞M</strong> is our flagship platform—created, designed, and completed by a solo founder + AI in under two months. Our goal is to empower creators and foster kindness through technology and creative freedom.
      </div>

      {/* --- Body --- */}
      <div className="space-y-5 text-base sm:text-lg text-[#222] leading-relaxed">
        <p>
          R∞M is not just a CMS. It's an infrastructure for the creative future, crafted with philosophy, speed, and flexibility in mind.
        </p>
        <p>
          The core philosophy: anyone, anywhere, deserves a space to express, connect, and thrive—regardless of age, nationality, or background.
        </p>
        <div className="bg-[#f8f9fb] rounded-lg p-4 mt-4 mb-4 shadow border border-[#f1c40f]/30">
          <strong>Key Features</strong>
          <ul className="list-disc pl-6 mt-2 text-sm sm:text-base text-gray-700">
            <li>Mobile-first experience (“Neko UI”)</li>
            <li>Multilingual support (English, Japanese, Arabic, Korean, Turkish,…)</li>
            <li>Video uploads &amp; secure HLS streaming</li>
            <li>Real-time community chat</li>
            <li>AI-powered proofing &amp; analytics</li>
            <li>Flexible deployment: Buyout, SaaS, Bulk License</li>
          </ul>
        </div>
        <p>
          <strong>Business Model:</strong>  
          R∞M can be provided as a one-time Buyout, monthly SaaS, or Bulk License for NGOs and institutions—always under the buyer’s direct ownership.
        </p>
        <div className="flex flex-col items-center mt-8">
          <button
            onClick={scrollToTopFooter}
            className="inline-block px-6 py-2 rounded-full text-white bg-gradient-to-r from-[#f70031] to-[#ffd700] font-bold shadow hover:scale-105 active:scale-98 transition-all text-base"
          >
            Contact HiRO
          </button>
          <span className="text-xs text-gray-500 mt-2">Jump to footer/contact on the top page</span>
        </div>
      </div>

      {/* --- Footer --- */}
      <div className="mt-14 text-center text-xs text-gray-500">
        &copy; 2025 WonderMetanism Inc. (HiRO + AI) | Tokyo, Japan
      </div>
    </main>
  );
}
