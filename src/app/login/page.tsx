"use client";

import React, { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-soft-blue/30">
      <div className="w-full max-w-md space-y-8 bg-white p-8 md:p-10 rounded-2xl border border-border-color shadow-lg hover-elevate transition-all duration-300">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-soft-blue text-primary">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold font-heading text-secondary">
            Admin Area
          </h2>
          <p className="mt-2 text-sm text-foreground/75">
            Log in to view inquiries and consultation bookings.
          </p>
        </div>

        <form action={formAction} className="mt-8 space-y-6">
          {state?.error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-foreground/40">
                  <User className="h-5 w-5" />
                </div>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="admin"
                  className="pl-10"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-foreground/40">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="pl-10"
                  autoComplete="current-password"
                />
              </div>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 text-base flex justify-center items-center gap-2 cursor-pointer font-semibold shadow-md hover:shadow-lg transition-all"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
