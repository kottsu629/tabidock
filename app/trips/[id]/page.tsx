import type { Metadata } from "next";
import TripDetailContainer from "./containers/container";

export const metadata: Metadata = {
  title: "旅行詳細",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TripDetailContainer tripId={id} />;
}
