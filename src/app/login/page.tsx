"use client";
import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: signInError } = await signIn.social({
        provider: "google",
        callbackURL: "/welcome",
      });

      if (signInError) {
        setError(signInError.message || "Google authentication failed. Please try again.");
      }
    } catch (err: any) {
      setError("An unexpected connection error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const { error } = await signIn.email({
          email,
          password,
          fetchOptions: {
            onSuccess: () => router.push("/welcome"),
            onError: (ctx) => setError(ctx.error.message || "Authentication failed"),
          }
        });
        if (error) setError(error.message || "Sign in failed");
      } else {
        const { error } = await signUp.email({
          email,
          password,
          name,
          fetchOptions: {
            onSuccess: () => router.push("/welcome"),
            onError: (ctx) => setError(ctx.error.message || "Registration failed"),
          }
        });
        if (error) setError(error.message || "Registration failed");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4 w-full pt-10 pb-20">
      <div className="w-full max-w-[400px]">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isLogin ? "Portal Login" : "Join Registry"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Access the decentralized college donor network
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200 font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-white border border-slate-300 text-slate-700 rounded-md font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 px-2 text-slate-400 font-bold tracking-widest">Or Entry</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                  placeholder="Student Name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                placeholder="college@edu"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-slate-900 text-white rounded-md font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm mt-2 shadow-sm"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLogin ? "Authenticate" : "Create Record"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-sm text-slate-500 hover:text-slate-900 underline underline-offset-4 decoration-slate-300 font-medium"
            >
              {isLogin ? "New to the database? Register" : "Have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
