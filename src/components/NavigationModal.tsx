"use client";
import React from "react";
import Link from "next/link";

export default function NavigationModal() {
  return (
    <div className="w-[90vw] max-w-sm p-6 bg-gradient-to-r from-[#f5f6f8] via-[#eaecef] to-[#ffffff] rounded-2xl shadow-lg transition-all duration-300 ease-in-out">
      <h2 className="text-lg font-semibold text-[#192349] mb-6">Menu</h2>
      <ul className="space-y-3 text-[#192349] font-medium">
        <li>
          <Link href="/posts" className="hover:text-[#f70031] hover:underline transition-all">
            News / Articles
          </Link>
        </li>
        <li>
          <Link href="/" className="hover:text-[#f70031] hover:underline transition-all">
            Back to Top
          </Link>
        </li>
        <li>
          <Link href="/policy" className="hover:text-[#f70031] hover:underline transition-all">
            Site Policy <span className="text-xs text-gray-500">(coming soon)</span>
          </Link>
        </li>
        <li>
          <Link href="/privacy" className="hover:text-[#f70031] hover:underline transition-all">
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-[#f70031] hover:underline transition-all">
            Contact / Inquiry
          </Link>
        </li>
      </ul>
    </div>
  );
}
