import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AppHeader from "./_components/AppHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://promptlab.io.kr";

const siteTitle = "PromptLab - AI 프롬프트 작업실";
const siteDescription =
  "AI 프롬프트를 작성, 저장, 관리하고 SafeCheck로 저장 전 위험 요소를 확인하는 웹 서비스입니다.";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  metadataBase: new URL(SITE_URL),
  verification: {
    google: "jnR9e_2rD2cYJr5-ZfNaCKWLBgqx9n9i411RoqO2A8s",
    other: {
      "naver-site-verification": "df6d569e5ba268b4baf19c9035c3640d610fefcd",
    },
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: SITE_URL,
    siteName: "PromptLab",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image-v2.png`,
        width: 1200,
        height: 630,
        alt: "PromptLab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [`${SITE_URL}/og-image-v2.png`],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
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
      <body
        className="min-h-full flex flex-col static-noise"
        style={{ background: "#0d1117" }}
      >
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

        <AppHeader />

        {children}

        <footer
          className="mt-auto py-5 text-center"
          style={{ borderTop: "1px solid #21262d" }}
        >
          <p className="text-xs font-medium" style={{ color: "#a0b4c8" }}>
            © 2026 PromptLab · PICTORY-DROID
          </p>
        </footer>

        <style>{`
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