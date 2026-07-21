import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ExploreTripDetailContainer from "./containers/container";

export const metadata: Metadata = {
  title: "公開旅行 | TabiDock",
  description: "TabiDockで公開されている旅行の詳細です。",
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function ExploreTripDetailPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  if (!uuidPattern.test(tripId)) notFound();
  return <ExploreTripDetailContainer tripId={tripId} />;
}
