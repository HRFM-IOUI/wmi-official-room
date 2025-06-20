"use client";
import React from "react";
import { MdAccessibility } from "react-icons/md"; // MdAccessibility アイコン
import { CgMenuMotion } from "react-icons/cg"; // CgMenuMotion アイコン

type FloatingButtonsProps = {
  onOpenAccessibility: () => void;
  onOpenNavigation: () => void;
};

export default function FloatingButtons({
  onOpenAccessibility,
  onOpenNavigation,
}: FloatingButtonsProps) {
  return (
    <div
      className="fixed bottom-4 left-0 w-full z-50 px-4 flex justify-between pointer-events-none"
    >
      <button
        onClick={onOpenAccessibility}
        className="pointer-events-auto backdrop-blur-md bg-[#192349]/80 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg hover:bg-[#192349]/90 transition-all duration-200 hover:scale-105 active:drop-shadow-xl"
        aria-label="Open accessibility settings"
      >
        <MdAccessibility /> {/* アクセシビリティアイコン */}
      </button>

      <button
        onClick={onOpenNavigation}
        className="pointer-events-auto backdrop-blur-md bg-gradient-to-r from-[#4f62b2] via-[#6f7fff] to-[#b072ff] text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg hover:brightness-110 transition-all duration-200 hover:scale-105 active:drop-shadow-xl"
        aria-label="Open navigation menu"
      >
        <CgMenuMotion /> {/* メニューアイコン */}
      </button>
    </div>
  );
}
