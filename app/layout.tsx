import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import ScrollProgressBar from "./components/ScrollProgressBar";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromptLab - 프롬프트 공유 커뮤니티",
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
      <body className="min-h-full flex flex-col static-noise" style={{ background: '#0d1117' }}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7T02L3YW4T"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7T02L3YW4T');
          `}
        </Script>
        <ScrollProgressBar />
        <Navbar />
        {children}
        <footer className="mt-auto py-4 text-center font-mono"
          style={{ borderTop: '1px solid #21262d' }}>
          <p className="text-xs" style={{ color: '#a0b4c8' }}>
            $ whoami → seoin · PICTORY-droid
            <span style={{
              color: '#7ec99a',
              animation: 'blink 1s step-end infinite',
            }}>▌</span>
          </p>
          <p className="text-xs mt-1" style={{ color: '#6b7988' }}>// since 2024.01</p>
        </footer>
        <style>{`
          @keyframes blink {
            50% { opacity: 0; }
          }
          @keyframes noise {
            0%   { transform: translate(0px, 0px); }
            10%  { transform: translate(-2px, 1px); }
            20%  { transform: translate(2px, -1px); }
            30%  { transform: translate(-1px, 2px); }
            40%  { transform: translate(1px, -2px); }
            50%  { transform: translate(-2px, 1px); }
            60%  { transform: translate(2px, 1px); }
            70%  { transform: translate(-1px, -1px); }
            80%  { transform: translate(1px, 2px); }
            90%  { transform: translate(-2px, -1px); }
            100% { transform: translate(0px, 0px); }
          }
          .static-noise::after {
            content: '';
            position: fixed;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            pointer-events: none;
            z-index: 9998;
            opacity: 0.018;
            animation: noise 0.15s steps(1) infinite;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
            background-size: 200px 200px;
          }
        `}</style>
      </body>
    </html>
  );
}