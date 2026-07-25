import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ExploreTripDetailContainer from "./containers/container";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tripId: string }>;
}): Promise<Metadata> {
  const { tripId } = await params;
  const title = "公開旅行の詳細";
  const description =
    "TabiDock（タビドック）で公開されている旅行の行き先・日程・予算・人数を確認できます。";

  return {
    title,
    description,
    alternates: {
      canonical: `/explore/${tripId}`,
    },
    openGraph: {
      type: "website",
      locale: "ja_JP",
      url: `/explore/${tripId}`,
      siteName: "TabiDock（タビドック）",
      title: `${title}｜TabiDock（タビドック）`,
      description,
    },
  };
}

export default async function ExploreTripDetailPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  if (!uuidPattern.test(tripId)) notFound();
  return <ExploreTripDetailContainer tripId={tripId} />;
}
