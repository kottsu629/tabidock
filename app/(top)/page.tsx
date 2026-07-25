import type { Metadata } from "next";
import LandingContainer from "./containers/container";

const title =
  "TabiDock（タビドック）｜旅行計画・費用管理・共有をひとつに";
const description =
  "TabiDock（タビドック）は、旅行の日程・行き先・参加者・費用をひとつにまとめて管理できる旅行管理アプリです。メンバーとの共同管理、費用の自動集計、公開旅行の閲覧・掲載にも対応しています。";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    siteName: "TabiDock（タビドック）",
    title,
    description,
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://tabidock.com/#website",
  url: "https://tabidock.com/",
  name: "TabiDock",
  alternateName: ["タビドック", "たびどっく", "tabidock.com"],
  description,
  inLanguage: "ja-JP",
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      <LandingContainer />
    </>
  );
}
