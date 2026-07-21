import type { Metadata } from "next";
import LandingContainer from "./containers/container";

const title =
  "TabiDock（タビドック）｜旅行計画・旅程・旅行費用をまとめて管理";
const description =
  "TabiDock（タビドック）は、旅行計画・旅程・旅行費用をひとつにまとめて管理できる旅行管理アプリです。グループ旅行の費用共有や公開旅行の閲覧にも対応しています。";

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
