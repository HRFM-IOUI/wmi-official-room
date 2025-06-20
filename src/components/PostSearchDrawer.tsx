"use client";
import React from "react";

type Props = {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onClose: () => void;
};

export default function PostSearchDrawer({ searchTerm, setSearchTerm, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative mt-20 w-full max-w-xl bg-white p-6 rounded-xl shadow-xl z-50" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#192349]">検索</h2>
          <button className="text-xl text-gray-400 hover:text-gray-600" onClick={onClose}>×</button>
        </div>
        <input
          type="text"
          placeholder="タイトルで検索..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full rounded-full border border-gray-300 px-5 py-3 text-base shadow focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>
    </div>
  );
}
