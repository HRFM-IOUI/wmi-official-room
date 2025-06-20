"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

type Block = {
  type: "heading" | "text" | "image" | "video";
  content: string;
};
type Post = {
  id: string;
  title: string;
  blocks?: Block[];
  image?: string;
  category?: string;
  createdAt: string | number | { seconds?: number };
};

const DEFAULT_IMAGE = "/WMI-logo.png";

function formatDate(dateVal: string | number | { seconds?: number }): string {
  if (!dateVal) return "";
  let d: Date;
  if (
    typeof dateVal === "object" &&
    "seconds" in dateVal &&
    typeof dateVal.seconds === "number"
  ) {
    d = new Date((dateVal.seconds ?? 0) * 1000);
  } else {
    d = new Date(dateVal as string | number);
  }
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type Props = { post: Post };

export default function HighlightHeroCard({ post }: Props) {
  const firstImage =
    post.blocks?.find((b) => b.type === "image" && b.content)?.content ||
    post.image ||
    DEFAULT_IMAGE;

  const description =
    post.blocks?.find((b) => b.type === "text" && b.content)?.content?.slice(0, 80) || "";

  return (
    <Link
      href={`/posts/${post.id}`}
      className="
        group w-full flex flex-col sm:flex-row bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden
        hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 ease-in-out
        min-h-[200px]
      "
    >
      {/* 画像セクション */}
      <div className="sm:w-1/2 w-full h-[200px] sm:h-auto relative flex-shrink-0">
        <Image
          src={firstImage}
          alt={post.title}
          width={430}
          height={280}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* テキストセクション */}
      <div className="sm:w-1/2 w-full p-6 flex flex-col justify-center min-w-0">
        <span className="inline-block bg-[#e3e8fc] text-xs text-[#192349] font-semibold px-2 py-0.5 rounded-full mb-2">
          {post.category
            ? post.category.charAt(0).toUpperCase() + post.category.slice(1)
            : "Uncategorized"}
        </span>
        <h2 className="text-2xl font-extrabold text-[#192349] mb-2 leading-snug group-hover:underline">
          {post.title}
        </h2>
        <p className="text-base text-gray-500 mb-1 line-clamp-2">{description}</p>
        <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
      </div>
    </Link>
  );
}
