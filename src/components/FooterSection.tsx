"use client";
import React from "react";
import Link from "next/link";

// ロゴ画像ファイル名・パスはpublic/wmLOGO.pngとして例示（必要に応じて変更）
const LOGO_PATH = "/wmLOGO.png";

export default function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-gray-200 pt-14 pb-10 px-4">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:justify-between gap-8">
        {/* ロゴ＆会社情報 */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          {/* ロゴ画像 */}
          <img
            src={LOGO_PATH}
            alt="WonderMetanism Inc. Logo"
            className="h-10 mb-3 select-none"
            draggable={false}
            style={{ filter: "contrast(1.05)" }}
          />
          <div className="text-lg font-bold tracking-tight mb-1 text-gray-800">WonderMetanism Inc.</div>
          <div className="text-xs text-gray-500 mb-1">Tokyo, Japan</div>
          <div className="text-xs text-gray-400">
            <span className="font-mono">2012401031802</span> | Registered: 2016
          </div>
        </div>
        {/* お問い合わせ */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right">
          <div className="text-sm font-medium text-gray-800 mb-1">Contact</div>
          {/* メールリンク（件名自動セット） */}
          <div className="flex items-center gap-2 mb-1">
            {/* メールアイコン */}
            <svg width="18" height="18" fill="none" viewBox="0 0 20 20" className="text-[#f70031]">
              <path d="M2.5 4.5h15a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm0 0l7.5 6.5 7.5-6.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            <a
              href="mailto:contact@wonder-metanism.com?subject=%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B%EF%BC%88WonderMetanism%E3%82%B5%E3%82%A4%E3%83%88%E3%82%88%E3%82%8A%EF%BC%89"
              className="text-[#f70031] font-semibold hover:underline transition"
            >
              contact@wonder-metanism.com
            </a>
          </div>
          {/* X (Twitter) リンク */}
          <div className="flex items-center gap-2 mb-1">
            {/* X（Twitter）アイコン */}
            <svg width="17" height="17" fill="none" viewBox="0 0 17 17" className="text-[#1cb5e0]">
              <path d="M3 3l11 11M14 3L3 14" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <a
              href="https://x.com/wondermetanism"
              target="_blank"
              className="text-[#1cb5e0] font-semibold hover:underline transition"
              rel="noopener noreferrer"
            >
              @wondermetanism
            </a>
          </div>
          <Link
            href="/privacy"
            className="text-xs text-[#f70031] font-semibold hover:underline mt-2 transition"
          >
            Privacy Policy
          </Link>
          <div className="text-[10px] text-gray-400 mt-1">
            *Serious/official inquiries only. No spam or solicitation, please.
          </div>
        </div>
      </div>
      {/* グラデーションバー（Heroボタンに近いカラー） */}
      <div
        className="w-full h-1.5 rounded-full mt-10"
        style={{
          background: "linear-gradient(90deg, #f70031 0%, #fdc80a 100%)"
        }}
      />
      {/* コピーライト */}
      <div className="mt-8 text-center text-xs text-gray-400 tracking-wider">
        COPYRIGHT © {year} WonderMetanism Inc. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
