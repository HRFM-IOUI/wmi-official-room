"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";
import PostsHero from "./PostsHero";
import Link from "next/link";

export default function MegaMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="flex items-center justify-between px-4 py-2 relative z-20 bg-transparent backdrop-blur-md sticky top-0"
      style={{ height: "60px" }}
    >
      <div className="font-semibold text-lg text-[#192349] flex-grow text-center">
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              aria-label="Open RooMMenU Menu"
              className="text-xl font-bold text-[#f70031] cursor-pointer hover:text-[#ffd700] underline transition-all duration-300"
              onClick={() => setOpen((prev) => !prev)}
            >
              RooMMenU
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay
              className="fixed inset-0 z-50 bg-black/30 animate-fadeIn"
              aria-hidden="true"
            />
            <Dialog.Content
              className="fixed z-[60] left-0 top-0 w-full h-full bg-white bg-opacity-90 backdrop-blur-lg flex flex-col items-center py-4 px-6 space-y-6 overflow-y-auto"
              aria-modal="true"
              role="dialog"
              aria-label="Site main menu"
            >
              <Dialog.Title>
                <VisuallyHidden>Site navigation menu for RooMNewS</VisuallyHidden>
              </Dialog.Title>

              {/* 閉じるボタン */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-5 right-6 text-3xl text-gray-400 hover:text-black"
                aria-label="Close menu"
              >
                ×
              </button>

              {/* メガメニュー・Apple風セクション */}
              <div className="w-full flex flex-col items-center gap-5 mt-6">
                <span className="text-2xl font-extrabold text-[#192349] tracking-tight drop-shadow-md">RooMMenU</span>

                {/* HeroSection風 Aboutボタン */}
                <Link href="/about">
                  <button
                    className="
                      px-8 py-3 rounded-full
                      bg-gradient-to-r from-[#f70031] to-[#ffd700]
                      text-white font-bold shadow-md
                      hover:scale-105 active:scale-98 transition-all
                      flex items-center gap-2
                    "
                    style={{ letterSpacing: ".05em" }}
                  >
                    About R∞M
                  </button>
                </Link>

                {/* ほかのメニュー */}
                <div className="flex flex-col items-center gap-3 mt-4">
                  <Link href="/posts" className="text-lg text-[#192349] hover:text-[#f70031] hover:underline font-medium transition-all">
                    News / Articles
                  </Link>
                  <Link href="/" className="text-lg text-[#192349] hover:text-[#f70031] hover:underline font-medium transition-all">
                    Back to Top
                  </Link>
                  <Link href="/privacy" className="text-lg text-[#192349] hover:text-[#f70031] hover:underline font-medium transition-all">
                    Privacy Policy
                  </Link>
                </div>
              </div>

              {/* サインインボタン（Hero風ボタンで統一） */}
              <div className="w-full flex justify-center mt-8">
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="
                    px-8 py-3 rounded-full
                    bg-gradient-to-r from-[#f70031] to-[#ffd700]
                    text-white font-bold shadow-md
                    hover:scale-105 active:scale-98 transition-all
                    flex items-center gap-2
                  "
                  aria-label="Sign in to dashboard"
                >
                  Sign In
                </button>
              </div>

              {/* 最新記事カルーセル */}
              <div className="w-full mt-8">
                <PostsHero postCount={10} />
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}
