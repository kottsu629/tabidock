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
    default: "TabiDock（タビドック）｜旅行計画・旅程・旅行費用をまとめて管理",
    template: "%s｜TabiDock（タビドック）",
  },
  description:
    "TabiDock（タビドック）は、旅行計画・旅程・旅行費用をひとつにまとめて管理できる旅行管理アプリです。グループ旅行の費用共有や公開旅行の閲覧にも対応しています。",
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
