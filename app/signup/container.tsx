"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SignupPresentation from "./presentation";

export default function SignupContainer() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError || !data.user) {
      setError(signUpError?.message ?? "エラーが発生しました");
      setLoading(false);
      return;
    }
    const { error: insertError } = await supabase
      .from("users")
      .insert({ id: data.user.id, name });
    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <SignupPresentation
      name={name}
      email={email}
      password={password}
      error={error}
      loading={loading}
      onNameChange={setName}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSignup}
    />
  );
}
