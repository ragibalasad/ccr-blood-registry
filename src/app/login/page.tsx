"use client";
import { useEffect, useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle, Droplet } from "lucide-react";
import { getSystemSettings } from "../admin/actions";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [settings, setSettings] = useState({ registrationEnabled: true, dataEntryEnabled: true });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchSettings() {
      const data = await getSystemSettings();
      if (!("error" in data)) {
        setSettings(data);
        // Force login tab if registration is disabled
        if (!data.registrationEnabled) {
          setIsLogin(true);
        }
      }
    }
    fetchSettings();
  }, []);

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
    <div className="flex flex-1 items-center justify-center p-4 w-full pt-12 pb-24">
      <div className="w-full max-w-[440px] bg-white border-2 border-slate-100 rounded-[2rem] p-8 sm:p-10 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
        
        {/* Decorative flair behind */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-red-50 to-rose-100 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:opacity-70 transition-opacity duration-700" />

        <div className="relative mb-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-200">
            <Droplet className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            {isLogin ? "Welcome back" : "Join the Registry"}
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-2">
            {isLogin ? "Log in to access the donor network" : "Create an account to help save lives"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border-2 border-red-100 font-bold text-center">
            {error}
          </div>
        )}

        {!settings.registrationEnabled && (
          <div className="mb-6 p-5 bg-amber-50 border-2 border-amber-100 rounded-2xl flex items-start gap-3 text-amber-800 animate-in fade-in slide-in-from-top-2">
            <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
                <p className="font-bold">Registrations Paused</p>
                <p className="font-medium mt-0.5 opacity-90">Signups are disabled currently. Existing users can still log in.</p>
            </div>
          </div>
        )}

        <div className="space-y-6 relative">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-4 px-4 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-200 transition-all duration-300 flex items-center justify-center gap-3 text-sm shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group/btn"
          >
            <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
          {!settings.registrationEnabled && (
            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-wider -mt-3 pb-2">
              Note: New accounts cannot be created via Google
            </p>
          )}

          <div className="relative my-6 pb-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2 border-slate-50"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="bg-white px-4 text-slate-300">Or continue with email</span>
            </div>
          </div>

          {(isLogin || settings.registrationEnabled) && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50/50 border-2 border-slate-100 focus:bg-white focus:outline-none focus:border-red-400 focus:ring-0 text-sm font-medium text-slate-900 placeholder-slate-300 transition-all duration-300"
                    placeholder="e.g. John Doe"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 px-1">College Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50/50 border-2 border-slate-100 focus:bg-white focus:outline-none focus:border-red-400 focus:ring-0 text-sm font-medium text-slate-900 placeholder-slate-300 transition-all duration-300"
                  placeholder="student@college.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50/50 border-2 border-slate-100 focus:bg-white focus:outline-none focus:border-red-400 focus:ring-0 text-sm font-medium text-slate-900 placeholder-slate-300 transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 bg-slate-900 text-white rounded-2xl text-base font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-xl duration-300"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {isLogin ? "Authenticate" : "Create Account"}
              </button>
            </form>
          )}

          <div className="pt-6 text-center border-t-2 border-slate-50">
            {settings.registrationEnabled ? (
              <button
                onClick={() => { setIsLogin(!isLogin); setError(""); }}
                className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors py-2 px-4 rounded-xl hover:bg-slate-50"
              >
                {isLogin ? "New to the database? Register here" : "Already have an account? Log in"}
              </button>
            ) : (
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide bg-slate-50 py-3 rounded-xl border border-dashed border-slate-200">
                  Registrations are currently closed
                </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
