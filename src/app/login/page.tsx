"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/auth-actions";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

// ─── Validation ───────────────────────────────────────────────────────────────

function validateEmail(email: string) {
  if (!email) return "Email is required";
  if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email address";
  return null;
}

function validatePassword(password: string) {
  if (!password) return "Password is required";
  return null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function HawkEdgeLogo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group" aria-label="HawkEdge Technologies — Home">
      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#00A3FF] to-[#004385] flex items-center justify-center shadow-lg shadow-[#00A3FF]/20 group-hover:shadow-[#00A3FF]/40 transition-shadow duration-300">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M12 2v20M3 7l9 5 9-5" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="text-xl font-bold font-heading text-white tracking-tight">HawkEdge</span>
    </Link>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

interface ToastProps {
  type: "success" | "error";
  message: string;
  onDismiss: () => void;
}

function Toast({ type, message, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 6000);
    return () => clearTimeout(timer);
  }, [onDismiss]);
  return (
    <div role="alert" aria-live="assertive"
      className={`fixed top-6 right-6 z-50 flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-2xl max-w-sm animate-slide-in-right backdrop-blur-sm ${
        type === "error"
          ? "bg-red-950/90 border-red-800/60 text-red-200"
          : "bg-emerald-950/90 border-emerald-800/60 text-emerald-200"
      }`}
    >
      {type === "error"
        ? <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        : <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
      <p className="text-sm font-medium leading-snug">{message}</p>
      <button onClick={onDismiss} className="ml-auto shrink-0 text-current/60 hover:text-current transition-colors" aria-label="Dismiss">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => { emailRef.current?.focus(); }, []);

  function handleEmailBlur() { setEmailError(validateEmail(email)); }
  function handlePasswordBlur() { setPasswordError(validatePassword(password)); }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) return;

    setIsLoading(true);
    setToast(null);

    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);

    const result = await loginAction(formData);
    setIsLoading(false);

    if ("error" in result) {
      setToast({ type: "error", message: result.error });
    } else {
      const msg = result.isNewUser
        ? "Account created! Welcome to HawkEdge \u2014 redirecting\u2026"
        : "Welcome back! Redirecting you now\u2026";
      setToast({ type: "success", message: msg });
      setTimeout(() => router.push(result.redirectTo), 900);
    }
  }


  return (
    <>
      {/* Toast notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onDismiss={() => setToast(null)}
        />
      )}

      {/* Full-screen dark layout */}
      <div className="min-h-screen bg-[#020B18] flex">

        {/* ── Left panel: branding + visual ── */}
        <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] flex-col relative overflow-hidden">
          {/* Layered gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#004385] via-[#020B18] to-[#020B18]" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(#00A3FF 1px, transparent 1px), linear-gradient(to right, #00A3FF 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Radial glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00A3FF]/8 blur-[120px] pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full px-12 xl:px-16 py-10">
            <HawkEdgeLogo />

            {/* Hero copy */}
            <div className="flex-1 flex flex-col justify-center max-w-xl mt-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00A3FF]/10 border border-[#00A3FF]/20 text-[#00A3FF] text-xs font-semibold tracking-wide uppercase mb-8 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A3FF] animate-pulse" />
                Precision Engineering Platform
              </div>

              <h1 className="text-4xl xl:text-5xl font-bold font-heading text-white leading-tight mb-6">
                Your workspace,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3FF] to-[#60CFFF]">
                  ready to launch.
                </span>
              </h1>

              <p className="text-[#8BA6C1] text-lg leading-relaxed mb-12">
                Sign in to manage your projects, review quotations, and collaborate with the HawkEdge engineering team — all in one place.
              </p>

              {/* Social proof stats */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: "150+", label: "Projects delivered" },
                  { value: "98%", label: "Client satisfaction" },
                  { value: "24h", label: "Avg. response time" },
                ].map((stat) => (
                  <div key={stat.label} className="border-l-2 border-[#00A3FF]/30 pl-4">
                    <div className="text-2xl font-bold font-heading text-white">{stat.value}</div>
                    <div className="text-xs text-[#8BA6C1] mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom footer */}
            <div className="text-[#4A6A8A] text-sm pb-4">
              © {new Date().getFullYear()} HawkEdge Technologies. All rights reserved.
            </div>
          </div>
        </div>

        {/* ── Right panel: login form ── */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-10 sm:px-10 lg:px-12">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <HawkEdgeLogo />
          </div>

          <div className="w-full max-w-[420px]">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white mb-2">
                Welcome back
              </h2>
              <p className="text-[#8BA6C1] text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/contact"
                  className="text-[#00A3FF] hover:text-[#60CFFF] font-medium transition-colors underline underline-offset-4"
                >
                  Contact our team
                </Link>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate aria-label="Sign in form" className="space-y-5">

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#C8D8E8] mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className={`w-4.5 h-4.5 transition-colors ${emailError ? "text-red-400" : "text-[#4A6A8A]"}`} aria-hidden="true" />
                  </div>
                  <input
                    ref={emailRef}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(null); }}
                    onBlur={handleEmailBlur}
                    placeholder="you@company.com"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                    className={`w-full h-12 rounded-xl pl-10 pr-4 bg-white/5 border text-white text-sm placeholder:text-[#4A6A8A] transition-all duration-200 outline-none
                      focus:bg-white/8 focus:border-[#00A3FF] focus:ring-2 focus:ring-[#00A3FF]/20
                      ${emailError ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20" : "border-white/10 hover:border-white/20"}
                    `}
                  />
                </div>
                {emailError && (
                  <p id="email-error" role="alert" className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-[#C8D8E8]">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[#00A3FF] hover:text-[#60CFFF] transition-colors"
                    tabIndex={0}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className={`w-4.5 h-4.5 transition-colors ${passwordError ? "text-red-400" : "text-[#4A6A8A]"}`} aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(null); }}
                    onBlur={handlePasswordBlur}
                    placeholder="••••••••••••"
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? "password-error" : undefined}
                    className={`w-full h-12 rounded-xl pl-10 pr-12 bg-white/5 border text-white text-sm placeholder:text-[#4A6A8A] transition-all duration-200 outline-none
                      focus:bg-white/8 focus:border-[#00A3FF] focus:ring-2 focus:ring-[#00A3FF]/20
                      ${passwordError ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20" : "border-white/10 hover:border-white/20"}
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#4A6A8A] hover:text-[#8BA6C1] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
                {passwordError && (
                  <p id="password-error" role="alert" className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="checkbox"
                  id="remember-me"
                  aria-checked={rememberMe}
                  onClick={() => setRememberMe((v) => !v)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-150 shrink-0
                    ${rememberMe
                      ? "bg-[#00A3FF] border-[#00A3FF] shadow-lg shadow-[#00A3FF]/30"
                      : "bg-white/5 border-white/20 hover:border-white/40"
                    }`}
                  aria-label="Remember me for 24 hours"
                >
                  {rememberMe && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                      <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
                <label
                  htmlFor="remember-me"
                  className="text-sm text-[#8BA6C1] cursor-pointer select-none"
                  onClick={() => setRememberMe((v) => !v)}
                >
                  Remember me for 24 hours
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#00A3FF] to-[#0082CC] hover:from-[#0096EB] hover:to-[#006EB5] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-[#00A3FF]/25 hover:shadow-[#00A3FF]/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#020B18] mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            {/* Footer links */}
            <div className="mt-8 pt-8 border-t border-white/8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {[
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms-and-conditions", label: "Terms of Service" },
                { href: "/contact", label: "Support" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-[#4A6A8A] hover:text-[#8BA6C1] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
