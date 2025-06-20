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
          {/* RooMNewSのテキストメニュー */}
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                aria-label="Open menu"
                className="text-xl font-bold text-[#f70031] cursor-pointer hover:text-[#ffd700] underline transition-all duration-300"
                onClick={() => setOpen((prev) => !prev)} // オンクリックでメニュー開閉
              >
                RooMNewS
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              {/* モーダル背景 */}
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 animate-fadeIn" />

              {/* モーダルコンテンツ */}
              <Dialog.Content className="fixed z-[60] left-0 top-0 w-full h-full bg-white bg-opacity-90 backdrop-blur-lg flex flex-col items-center py-4 px-6 space-y-6 overflow-y-auto">
                {/* ここでDialog.Titleを確実に表示 */}
                <Dialog.Title>
                  <VisuallyHidden>Navigation Menu</VisuallyHidden> {/* スクリーンリーダー向けタイトル */}
                </Dialog.Title>

                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-5 right-6 text-3xl text-gray-400 hover:text-black"
                >
                  ×
                </button>

                {/* メガメニューのテキストとリンク */}
                <div className="w-full flex items-center justify-center gap-6 mt-4 flex-col space-y-4">
                  <span className="text-xl font-bold text-[#f70031]">RooMNewS</span>
                </div>

                {/* サインインボタンをRooMNewS直下に移動、中央配置 */}
                <div className="w-full flex justify-center px-6 py-3 bg-white">
                  <button
                    onClick={() => (window.location.href = "/login")}
                    className="w-auto py-3 px-8 text-lg font-medium text-white bg-[#f70031] rounded-md hover:bg-[#ff4f6e] transition"
                  >
                    Sign In
                  </button>
                </div>

                {/* HeroPostsコンポーネントの追加 */}
                <div className="w-full mt-6">
                  <PostsHero postCount={10} /> {/* 投稿数は必要に応じて設定 */}
                </div>
                
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </>
  );
}
