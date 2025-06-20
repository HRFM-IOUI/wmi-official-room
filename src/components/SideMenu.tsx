"use client";
import React from "react";

// グラデーションカラーをWMIテーマで統一
const SIDE_BG = "linear-gradient(135deg, #f5f6fa 0%, #b072ff 45%, #192349 100%)";

export default function SideMenu({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <aside
      className={`${
        isMobile ? "" : "fixed top-[76px] right-[8px]"
      } w-[260px] rounded-3xl shadow-lg z-40 p-0 border border-white/12 flex flex-col overflow-hidden transition-all`}
      style={{
        minHeight: "unset",
        height: "auto",
        background: SIDE_BG,
        justifyContent: "flex-start",
        ...(isMobile
          ? {
              position: "static",
              inset: "unset",
              top: "unset",
              right: "unset",
              left: "unset",
              margin: "0 auto",
              boxShadow: "0 4px 32px 8px rgba(25,35,73,0.13)",
            }
          : {}),
      }}
      aria-label="Site menu"
    >
      <div className="flex flex-col w-full px-6 pt-7 pb-0">
        {/* Menu Header */}
        <div>
          <div className="font-bold text-lg mb-6 tracking-wide text-white drop-shadow">
            Navigation
          </div>
          <nav>
            <ul className="text-base leading-8">
              <li>
                <a
                  href="/board"
                  className="hover:text-[#ffd700] hover:underline text-white/90 transition-colors"
                >
                  Discussion Board
                </a>
              </li>
              <li>
                <a
                  href="/library"
                  className="hover:text-[#ffd700] hover:underline text-white/90 transition-colors"
                >
                  Creative Archives
                </a>
              </li>
              <li>
                <a
                  href="/support"
                  className="hover:text-[#ffd700] hover:underline text-white/90 transition-colors"
                >
                  Join / Support R∞M
                </a>
              </li>
              <li>
                <a
                  href="/policy"
                  className="hover:text-[#ffd700] hover:underline text-white/80 transition-colors"
                >
                  Site Policy
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="hover:text-[#ffd700] hover:underline text-white/80 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/legal"
                  className="hover:text-[#ffd700] hover:underline text-white/80 transition-colors"
                >
                  Legal Disclosure
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <hr className="border-t border-white/20 my-0" />

        {/* Footer Information */}
        <div className="text-base leading-6 font-normal mt-0 mb-0 py-2 px-0 text-center text-white/80">
          Operated by WonderMetanism Inc.<br />
          Tokyo, Japan<br />
          Tel &amp; Fax:<br />
          <a href="tel:+81300000000" className="text-[#43A9E6] font-bold">
            +81-3-0000-0000
          </a>
        </div>
      </div>
    </aside>
  );
}
