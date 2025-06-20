"use client"; 
import React, { useEffect, useState } from "react";

export default function FooterSection() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer
      className="w-full bg-white text-gray-800 pt-10 sm:pt-14 pb-12 px-6 sm:px-8 shadow-lg"
    >
      {/* メインフッター */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-8">
        <div className="text-center sm:text-left text-sm leading-relaxed text-gray-700">
          <div className="font-semibold text-lg mb-2">
            WonderMetanism Inc.（WMI）Main Office
          </div>
          <div className="text-gray-500 text-xs">Tokyo, Japan</div>
        </div>
      </div>

      {/* グラデーションバー */}
      <div
        className="w-full h-1.5 sm:h-2 mt-8 sm:mt-10 rounded-full"
        style={{
          background: "linear-gradient(90deg, #f5f5f5 0%, #e0e0e0 50%, #d0d0d0 100%)"
        }}
      />

      {/* コピーライト */}
      {year !== null && (
        <div className="text-center text-xs text-gray-500 mt-8 sm:mt-12">
          <p className="font-medium">COPYRIGHT © {year} WonderMetanism Inc.</p>
          <p className="text-gray-400">ALL RIGHTS RESERVED.</p>
        </div>
      )}
    </footer>
  );
}
