"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function FooterSection() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full bg-white text-gray-800 pt-10 sm:pt-14 pb-12 px-6 sm:px-8 shadow-lg">
      {/* Main Footer Info */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-8">
        <div className="text-center sm:text-left text-sm leading-relaxed text-gray-700">
          <div className="font-semibold text-lg mb-2">
            WonderMetanism Inc. (WMI) — Main Office
          </div>
          <div className="text-gray-500 text-xs mb-2">Tokyo, Japan</div>
          <div className="text-gray-400 text-xs">
            Company Registration Number (Houjin Bangou): <span className="font-mono">2012401031802</span><br />
            Registry Number (Houmushou Touroku): <span className="font-mono">0124-01-031802</span><br />
            Date of Registration: Sep 7, 2016
          </div>
        </div>
        {/* Contact Info */}
        <div className="mt-6 sm:mt-0 text-center sm:text-right text-xs text-gray-600">
          <div className="mb-1 font-bold text-gray-700">Contact (inquiries/investment):</div>
          <div>
            Email:&nbsp;
            <span className="font-semibold text-[#f70031]">
              ik39.10vevic[at]gmail.com
            </span>
            <span className="ml-2 text-gray-400 text-[10px]">(replace [at] with @)</span>
          </div>
          <div>
            X (DM):&nbsp;
            <a
              href="https://x.com/wondermetanism"
              target="_blank"
              className="underline text-[#1cb5e0] font-semibold"
              rel="noopener noreferrer"
            >
              @wondermetanism
            </a>
          </div>
          <div className="mt-3">
            <Link
              href="/privacy"
              className="underline text-[#f70031] font-semibold text-xs hover:text-[#b90027] transition"
            >
              Privacy Policy
            </Link>
          </div>
          <div className="text-[10px] text-gray-400 mt-1">
            *Serious/official inquiries only. No spam or solicitation, please.
          </div>
        </div>
      </div>

      {/* Gradient Bar */}
      <div
        className="w-full h-1.5 sm:h-2 mt-8 sm:mt-10 rounded-full"
        style={{
          background: "linear-gradient(90deg, #f5f5f5 0%, #e0e0e0 50%, #d0d0d0 100%)"
        }}
      />

      {/* Copyright */}
      {year !== null && (
        <div className="text-center text-xs text-gray-500 mt-8 sm:mt-12">
          <p className="font-medium">COPYRIGHT © {year} WonderMetanism Inc.</p>
          <p className="text-gray-400">ALL RIGHTS RESERVED.</p>
        </div>
      )}
    </footer>
  );
}
