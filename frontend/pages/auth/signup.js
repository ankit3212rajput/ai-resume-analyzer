import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import AuthShell from "@/components/common/AuthShell";
import Seo from "@/components/seo/Seo";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated, signup, googleLogin } = useAuth();
  const googleEnabled = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await signup(form);
      toast.success("Account created.");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    try {
      await googleLogin({ token: credentialResponse.credential });
      toast.success("Signed up with Google.");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <Seo title="Sign Up | AI Resume Analyzer Pro" canonical="/auth/signup" />
      <AuthShell
        title="Create account"
        subtitle="Start with a free plan and upgrade when you need more advanced AI tools."
        alternateHref="/auth/login"
        alternateLabel="Already have an account? Log in"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="rounded-[18px] border border-slate-200 px-4 py-3 outline-none focus:border-tide"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="rounded-[18px] border border-slate-200 px-4 py-3 outline-none focus:border-tide"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="rounded-[18px] border border-slate-200 px-4 py-3 outline-none focus:border-tide"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        {googleEnabled ? (
          <div className="mt-5 flex justify-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google sign-in failed")} />
          </div>
        ) : null}
      </AuthShell>
    </>
  );
}
