import type { Metadata } from "next";
import SignupContainer from "./containers/container";

export const metadata: Metadata = {
  title: "新規登録",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupPage() {
  return <SignupContainer />;
}
