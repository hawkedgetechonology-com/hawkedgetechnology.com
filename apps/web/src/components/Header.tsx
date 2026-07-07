'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@hawkedge/ui';

interface NavItem {
  name: string;
  href: string;
  index: string;
}

const navItems: NavItem[] = [
  { name: 'About', href: '/about', index: '01' },
  { name: 'Services', href: '/services', index: '02' },
  { name: 'Projects', href: '/projects', index: '03' },
  { name: 'Case Studies', href: '/case-studies', index: '04' },
  { name: 'Industries', href: '/industries', index: '05' },
  { name: 'Technology', href: '/technology', index: '06' },
  { name: 'Internships', href: '/internships', index: '07' },
  { name: 'Careers', href: '/careers', index: '08' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-bg-base/95 border-b border-border-subtle backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-baseline gap-2 focus:outline-none">
            <span className="font-heading font-extrabold text-xl tracking-wider text-text-primary">
              HAWKEDGE
            </span>
            <span className="font-mono text-[9px] text-brand-primary tracking-widest uppercase hidden sm:inline">
              // DISCOVER
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 text-xs font-mono tracking-tight transition-colors focus:outline-none focus:text-text-primary ${
                  isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <span className="text-[9px] text-brand-primary mr-1">{item.index}</span>
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-brand-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/contact" className="focus:outline-none">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Start Your Project
            </Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <Link href="/contact" className="focus:outline-none">
            <Button variant="primary" size="sm" className="h-9 px-3">
              Start
            </Button>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-text-muted hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-border-brand focus:ring-offset-2 focus:ring-offset-bg-base"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 top-16 z-40 w-full h-[calc(100vh-64px)] bg-bg-base border-t border-border-subtle px-6 py-8 overflow-y-auto lg:hidden"
          >
            <div className="flex flex-col h-full justify-between">
              <div className="grid gap-6">
                <span className="font-mono text-[10px] text-brand-primary tracking-widest uppercase">
                  // NAVIGATION INDEX
                </span>
                <div className="grid gap-4 border-t border-border-subtle pt-4">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-baseline gap-4 py-2 font-heading text-xl tracking-tight focus:outline-none ${
                          isActive ? 'text-text-primary font-bold border-l-2 border-brand-primary pl-3' : 'text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        <span className="font-mono text-xs text-brand-primary">{item.index}</span>
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-border-subtle pt-6 pb-12 flex flex-col gap-4">
                <Link href="/contact" className="w-full">
                  <Button
                    variant="primary"
                    className="w-full h-12"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Start Your Project
                  </Button>
                </Link>
                <div className="flex justify-between items-center text-[10px] font-mono text-text-muted">
                  <span>SYSTEM STATUS: OPERATIONAL</span>
                  <span>HAWKEDGE DISCOVER</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
