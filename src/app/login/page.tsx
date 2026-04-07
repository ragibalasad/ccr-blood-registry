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
  const [error, setError] = useState("");
  const router = useRouter();

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
            onSuccess: () => router.push("/profile"),
            onError: (ctx) => setError(ctx.error.message),
          }
        });
        if (error) setError(error.message);
      } else {
        const { error } = await signUp.email({
          email,
          password,
          name,
          fetchOptions: {
            onSuccess: () => router.push("/profile"),
            onError: (ctx) => setError(ctx.error.message),
          }
        });
        if (error) setError(error.message);
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
            {isLogin ? "Sign In" : "Create Account"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {isLogin ? "Enter your email to sign in" : "Enter your email below to create your account"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1.5">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                placeholder="John Doe"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
              placeholder="m@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm mt-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-sm text-slate-500 hover:text-slate-900 underline underline-offset-4 decoration-slate-300"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
