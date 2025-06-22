"use client";
import React from "react";

export default function AccessibilityModal() {
  const setFontSize = (size: "small" | "medium" | "large") => {
    document.body.classList.remove("font-small", "font-medium", "font-large");
    document.body.classList.add(`font-${size}`);
  };

  const setTheme = (theme: "normal" | "light" | "dark") => {
    document.body.classList.remove("theme-normal", "theme-light", "theme-dark");

    if (theme === "light") {
      document.body.classList.add("theme-light");
    } else if (theme === "dark") {
      document.body.classList.add("theme-dark");
    } else if (theme === "normal") {
      document.body.classList.add("theme-normal");
    }
  };

  return (
    <div className="w-[90vw] max-w-md p-6 bg-white rounded-2xl shadow-xl transition-all duration-300 ease-in-out">
      <h2 className="text-lg font-bold mb-4 text-[#192349]">Accessibility Settings</h2>

      {/* フォントサイズ切替 */}
      <div className="mb-4">
        <p className="mb-1 font-medium text-[#192349]">Font Size:</p>
        <div className="flex gap-2">
          <button
            onClick={() => setFontSize("small")}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-300 transition-all"
          >
            S
          </button>
          <button
            onClick={() => setFontSize("medium")}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-300 transition-all"
          >
            M
          </button>
          <button
            onClick={() => setFontSize("large")}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-300 transition-all"
          >
            L
          </button>
        </div>
      </div>

      {/* カラーモード切替 */}
      <div className="mb-6">
        <p className="mb-1 font-medium text-[#192349]">Color Mode:</p>
        <div className="flex gap-2">
          <button
            onClick={() => setTheme("normal")}
            className="px-4 py-2 bg-white border rounded hover:bg-[#f5f6f8] transition-all"
          >
            Normal
          </button>
          <button
            onClick={() => setTheme("light")}
            className="px-4 py-2 bg-gray-100 border rounded hover:bg-[#f5f6f8] transition-all"
          >
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className="px-4 py-2 bg-black text-white border rounded hover:bg-[#333333] transition-all"
          >
            Dark
          </button>
        </div>
      </div>
    </div>
  );
}
