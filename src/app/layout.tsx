import React from "react";
import "@/styles/globals.css";

export const metadata = {
  title: "Room",
  description: "Creative Dashboard CMS by WMI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className="relative min-h-screen theme-normal"
        style={{ overflowX: "hidden" }}  // ← これで親で完全ガード
      >
        <div className="relative z-10 w-full flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
