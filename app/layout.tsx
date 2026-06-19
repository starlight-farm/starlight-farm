import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "별빛목장 | 화순 무항생제 원유 수제 요거트",
  description: "화순에서 직접 생산한 무항생제 원유로 만드는 별빛목장 수제 요거트. HACCP 인증 생산시설에서 정성껏 제조합니다.",
  verification: {
    google: "o83NpK2DTSVBdOm5wYwDcwy-XDYFHsETYBLP6GJIR1A",
    other: {
      "naver-site-verification":
        "c883ce9d94db03d483cd514b723957b3a73fed7f",
    },
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
      <body className="min-h-full flex flex-col">

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7RT82FNGB6"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-7RT82FNGB6');
          `}
        </Script>

        {children}

        </body>
    </html>
  );
}