"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Careers", href: "/careers" },
];

interface NavbarProps {
  isLoggedIn?: boolean;
}

export function Navbar({ isLoggedIn = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center z-50">
          <div className="relative h-12 md:h-14 aspect-square">
            <Image 
              src="/logo.jpg" 
              alt="HawkEdge Technologies Logo" 
              fill 
              sizes="(max-width: 768px) 48px, 56px"
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
          {isLoggedIn ? (
            <>
              <Link href="/workspace" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Workspace
              </Link>
              <form action={async () => {
                const { logoutAction } = await import("@/lib/auth-actions");
                await logoutAction();
              }}>
                <button type="submit" className="text-sm font-medium text-foreground hover:text-red-500 transition-colors">
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Sign In
            </Link>
          )}
          <Link href="/contact">
            <Button variant="primary" className="cursor-pointer">Start Your Project</Button>
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md border-t border-border-color md:hidden">
          <nav className="flex flex-col p-6 space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-medium text-foreground hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isLoggedIn ? (
              <>
                <Link
                  href="/workspace"
                  className="text-base font-medium text-foreground hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Workspace
                </Link>
                <form action={async () => {
                  const { logoutAction } = await import("@/lib/auth-actions");
                  await logoutAction();
                }}>
                  <button type="submit" className="text-base font-medium text-foreground hover:text-red-500 text-left w-full">
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="text-base font-medium text-foreground hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
            <Link href="/contact">
              <Button variant="primary" className="w-full justify-center cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                Start Your Project
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
