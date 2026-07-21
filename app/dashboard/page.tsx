import type { Metadata } from "next";
import DashboardContainer from "./containers/container";

export const metadata: Metadata = {
  title: "マイページ",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <DashboardContainer />;
}
