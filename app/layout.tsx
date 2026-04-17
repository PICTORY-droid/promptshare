import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import ScrollProgressBar from "./components/ScrollProgressBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromptShare - 프롬프트 공유 커뮤니티",
  description: "AI 프롬프트를 발견하고, 공유하고, 함께 성장하세요.",
  verification: {
    google: "jnR9e_2rD2cYJr5-ZfNaCKWLBgqx9n9i411RoqO2A8s",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ background: '#0d1117' }}>
        <ScrollProgressBar />
        <Navbar />
        {children}
        <footer className="mt-auto py-6 text-center font-mono"
          style={{ borderTop: '1px solid #21262d' }}>
          <p style={{ color: '#58a6ff' }}>// made by seoin · PICTORY-droid</p>
          <p style={{ color: '#3fb950' }}>// since 2024.01</p>
        </footer>
      </body>
    </html>
  );
}