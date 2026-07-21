import TripDetailContainer from "./containers/container";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TripDetailContainer tripId={id} />;
}
