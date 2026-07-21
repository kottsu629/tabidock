import type { Metadata } from "next";
import LoginContainer from "./containers/container";

export const metadata: Metadata = {
  title: "ログイン",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginContainer />;
}
