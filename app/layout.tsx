import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tabidock.com"),
  applicationName: "TabiDock（タビドック）",
  title: {
    default: "TabiDock（タビドック）｜旅行計画・費用管理・共有をひとつに",
    template: "%s｜TabiDock（タビドック）",
  },
  description:
    "TabiDock（タビドック）は、旅行の日程・行き先・参加者・費用をひとつにまとめて管理できる旅行管理アプリです。メンバーとの共同管理、費用の自動集計、公開旅行の閲覧・掲載にも対応しています。",
  creator: "TabiDock",
  publisher: "TabiDock",
  verification: {
    google: "k-3NYxB6YzWw1VmNfx0q1_ktBW6zYR57F2iLrHNybHY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
