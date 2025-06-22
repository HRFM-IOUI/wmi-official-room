"use client";
import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-2xl mx-auto py-10 px-4 text-[#192349]">
      <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        We respect your privacy. Any personal information (such as your name, email address, or message contents)
        sent via our contact form or email will be kept strictly confidential and will never be shared with third parties.
      </p>
      <p className="mb-4">
        Your information is used only for responding to your inquiries.
        If you have any questions, please contact us by email or DM on X (Twitter).
      </p>
      <p className="mt-10 text-xs text-gray-400">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </main>
  );
}
