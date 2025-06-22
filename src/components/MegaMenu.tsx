"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";
import PostsHero from "./PostsHero"; // HeroPostsコンポーネントのインポート

export default function MegaMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="flex items-center justify-between px-4 py-2 relative z-20 bg-transparent backdrop-blur-md sticky top-0"
        style={{ height: "60px" }}
      >
        {/* メニュー中央寄せ */}
        <div className="font-semibold text-lg text-[#192349] flex-grow text-center">
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                aria-label="Open RooMNewS Menu"
                className="text-xl font-bold text-[#f70031] cursor-pointer hover:text-[#ffd700] underline transition-all duration-300"
                onClick={() => setOpen((prev) => !prev)}
              >
                RooMNewS
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
                {/* Dialogタイトル（非表示でアクセシビリティ用） */}
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

                {/* メガメニューのテキスト */}
                <div className="w-full flex items-center justify-center gap-6 mt-4 flex-col space-y-4">
                  <span className="text-xl font-bold text-[#f70031]">RooMNewS</span>
                </div>

                {/* サインインボタン */}
                <div className="w-full flex justify-center px-6 py-3 bg-white">
                  <button
                    onClick={() => (window.location.href = "/login")}
                    className="w-auto py-3 px-8 text-lg font-medium text-white bg-[#f70031] rounded-md hover:bg-[#ff4f6e] transition"
                    aria-label="Sign in to dashboard"
                  >
                    Sign In
                  </button>
                </div>

                {/* HeroPosts（画像がある場合はalt必須） */}
                <div className="w-full mt-6">
                  <PostsHero postCount={10} />
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </>
  );
}
