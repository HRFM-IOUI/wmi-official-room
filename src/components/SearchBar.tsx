"use client";
import React from "react";

type Props = {
  searchTerm: string;
  setSearchTerm: (s: string) => void;
};

export default function SearchBar({ searchTerm, setSearchTerm }: Props) {
  return (
    <div className="relative w-full max-w-[350px]">
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="
          w-full pl-11 pr-10 py-2 rounded-full border border-[#f70031]
          bg-white text-[#192349] text-base shadow-sm
          focus:ring-2 focus:ring-[#f70031] focus:outline-none
          transition placeholder-[#a5a5a5]
        "
        aria-label="Search articles"
      />
      {/* 検索アイコン */}
      <span className="absolute left-3 top-2.5 text-[#f70031]">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="8" cy="8" r="6" />
          <line x1="13" y1="13" x2="17" y2="17" />
        </svg>
      </span>
      {/* 入力クリア */}
      {searchTerm && (
        <button
          type="button"
          onClick={() => setSearchTerm("")}
          className="absolute right-3 top-2.5 text-[#f70031] hover:text-[#ffd700]"
          aria-label="Clear"
        >
          ×
        </button>
      )}
    </div>
  );
}
