"use client";
import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-2xl mx-auto py-10 px-4 text-[#192349]">
      <h1 className="text-3xl font-extrabold mb-6 text-center">Privacy Policy</h1>
      <p className="mb-4 text-base">
        WonderMetanism Inc. (“we”, “our”, or “us”) is committed to protecting your privacy.
        We handle all personal information—such as your name, email address, and any messages you send us—with strict confidentiality.
        We do not share your information with any third parties unless required by law.
      </p>
      <p className="mb-4 text-base">
        Personal data you provide will only be used to respond to your inquiries or to provide essential updates regarding our services.
        We do not use your information for marketing or advertising purposes without your explicit consent.
      </p>
      <p className="mb-4 text-base">
        You may contact us at any time to request corrections or deletion of your information.
        Please reach out via email or DM on X (Twitter) for privacy-related concerns or questions.
      </p>
      <p className="mb-8 text-base">
        By using our site, you agree to this Privacy Policy. We may update this policy; the latest version will always be posted on this page.
      </p>
      <div className="text-xs text-gray-400 mb-12">
        Last updated: {new Date().toLocaleDateString()}
      </div>
      <div className="flex justify-center">
        <Link
          href="/"
          className="px-8 py-3 rounded-full bg-gradient-to-r from-[#f70031] to-[#ffd700] text-white font-bold shadow hover:scale-105 transition-all"
        >
          Back to Top
        </Link>
      </div>
    </main>
  );
}
