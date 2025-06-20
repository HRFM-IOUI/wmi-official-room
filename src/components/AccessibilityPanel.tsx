"use client";
import React from "react";

export default function AccessibilityModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white w-[90vw] max-w-md p-6 rounded-2xl shadow-lg transition-all duration-300 ease-in-out">
        <h2 className="text-lg font-bold mb-4 text-[#192349]">Accessibility Settings</h2>

        {/* フォントサイズ切替 */}
        <div className="mb-4">
          <p className="mb-1 font-medium text-[#192349]">Font Size:</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                document.body.classList.remove("font-medium", "font-large");
                document.body.classList.add("font-small");
              }}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-all"
            >
              S
            </button>
            <button
              onClick={() => {
                document.body.classList.remove("font-small", "font-large");
                document.body.classList.add("font-medium");
              }}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-all"
            >
              M
            </button>
            <button
              onClick={() => {
                document.body.classList.remove("font-small", "font-medium");
                document.body.classList.add("font-large");
              }}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-all"
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
              onClick={() => {
                document.body.classList.remove("theme-light", "theme-dark");
              }}
              className="px-4 py-2 bg-white border rounded hover:bg-[#f8f9fa] transition-all"
            >
              Normal
            </button>
            <button
              onClick={() => {
                document.body.classList.remove("theme-dark");
                document.body.classList.add("theme-light");
              }}
              className="px-4 py-2 bg-gray-100 border rounded hover:bg-[#f8f9fa] transition-all"
            >
              Light
            </button>
            <button
              onClick={() => {
                document.body.classList.remove("theme-light");
                document.body.classList.add("theme-dark");
              }}
              className="px-4 py-2 bg-black text-white border rounded hover:bg-[#444444] transition-all"
            >
              Dark
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 bg-[#f70031] text-white py-2 rounded hover:bg-[#ffd700] transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
}
