"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/ui/components/Button";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { Badge } from "@/ui/components/Badge";
import { FeatherCheck, FeatherCpu, FeatherZap, FeatherShare2, FeatherSun, FeatherMoon } from "@subframe/core";

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Sync state with the class applied by the blocking script in layout.tsx
    const hasDarkClass = document.documentElement.classList.contains("dark");
    // Use requestAnimationFrame to avoid cascading renders
    requestAnimationFrame(() => {
      setIsDark(hasDarkClass);
    });
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="flex w-full flex-col items-center bg-[var(--background)] transition-colors duration-300">
      {/* Hero Section */}
      <div className="flex w-full flex-col items-center bg-brand-600 px-6 pt-6 pb-32 mobile:px-6 mobile:pb-24">
        {/* Header */}
        <div className="flex w-full max-w-[1024px] items-center justify-between mb-16">
          <span className="font-[var(--font-bagel-fat-one)] text-[20px] text-white">
            🎣 BaitList
          </span>
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <FeatherSun className="w-5 h-5 text-white" />
            ) : (
              <FeatherMoon className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
        
        {/* Hero Content */}
        <div className="flex w-full max-w-[1024px] flex-col items-center gap-6">
          <h1 className="w-full max-w-[768px] whitespace-pre-wrap font-[var(--font-bagel-fat-one)] text-[64px] font-[400] leading-[72px] text-white text-center tracking-normal mobile:text-[48px] mobile:leading-[56px]">
            BaitList. Waitlists that get users hooked.
          </h1>
          <p className="w-full max-w-[576px] whitespace-pre-wrap font-[var(--font-merriweather)] text-[20px] font-[400] leading-[32px] text-brand-100 text-center">
            Smart waitlists that automatically prioritize your best leads.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/login">
              <Button
                variant="brand-secondary"
                size="large"
                className="font-[var(--font-geist-sans)] font-bold bg-white hover:bg-gray-50"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="flex w-full flex-col items-center justify-center gap-12 bg-[var(--background)] px-6 py-24 transition-colors duration-300">
        <div className="flex w-full max-w-[1024px] flex-col items-center gap-4">
          <h2 className="font-[var(--font-geist-sans)] text-[40px] font-bold leading-[44px] text-[var(--foreground)] text-center -tracking-[0.02em]">
            Smart waitlists, real results
          </h2>
          <p className="max-w-[576px] font-[var(--font-merriweather)] text-[18px] font-[400] leading-[28px] text-[var(--foreground)] opacity-70 text-center">
            Stop wasting time on tire-kickers. Our AI finds your best leads automatically.
          </p>
        </div>
        <div className="w-full max-w-[1024px] flex-wrap items-start justify-center gap-8 grid grid-cols-3 mobile:grid mobile:grid-cols-1">
          {/* Feature 1: AI-Powered Scoring */}
          <div className="flex min-w-[240px] grow shrink-0 basis-0 flex-col items-center gap-6">
            <IconWithBackground
              variant="brand"
              size="x-large"
              icon={<FeatherCpu />}
              square={false}
            />
            <div className="flex w-full flex-col items-center gap-2">
              <h3 className="w-full font-[var(--font-geist-sans)] text-[24px] font-bold leading-[28px] text-[var(--foreground)] text-center">
                AI-Powered Scoring
              </h3>
              <p className="w-full whitespace-pre-wrap font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-[var(--foreground)] opacity-70 text-center">
                GPT-4 evaluates every signup automatically. No more manual review of hundreds of applications.
              </p>
            </div>
          </div>
          {/* Feature 2: Auto-Approval */}
          <div className="flex min-w-[240px] grow shrink-0 basis-0 flex-col items-center gap-6">
            <IconWithBackground
              variant="brand"
              size="x-large"
              icon={<FeatherZap />}
              square={false}
            />
            <div className="flex w-full flex-col items-center gap-2">
              <h3 className="w-full font-[var(--font-geist-sans)] text-[24px] font-bold leading-[28px] text-[var(--foreground)] text-center">
                Auto-Approval
              </h3>
              <p className="w-full whitespace-pre-wrap font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-[var(--foreground)] opacity-70 text-center">
                Scores 92+ get instant access—no manual review needed. High-intent users don&apos;t wait.
              </p>
            </div>
          </div>
          {/* Feature 3: Gamification */}
          <div className="flex min-w-[240px] grow shrink-0 basis-0 flex-col items-center gap-6">
            <IconWithBackground
              variant="brand"
              size="x-large"
              icon={<FeatherShare2 />}
              square={false}
            />
            <div className="flex w-full flex-col items-center gap-2">
              <h3 className="w-full font-[var(--font-geist-sans)] text-[24px] font-bold leading-[28px] text-[var(--foreground)] text-center">
                Gamification
              </h3>
              <p className="w-full whitespace-pre-wrap font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-[var(--foreground)] opacity-70 text-center">
                Share to move up the queue. Turn waitlists into viral growth engines.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="flex w-full flex-col items-center justify-center gap-12 bg-[var(--section-alt-bg)] px-6 py-24 transition-colors duration-300">
        <div className="flex w-full max-w-[1024px] flex-col items-center gap-4">
          <h2 className="font-[var(--font-geist-sans)] text-[40px] font-bold leading-[44px] text-[var(--foreground)] text-center -tracking-[0.02em]">
            Simple, transparent pricing
          </h2>
          <p className="max-w-[576px] font-[var(--font-merriweather)] text-[18px] font-[400] leading-[28px] text-[var(--foreground)] opacity-70 text-center">
            Start free. Upgrade when you need more.
          </p>
        </div>
        <div className="flex w-full max-w-[1024px] flex-wrap items-start justify-center gap-8">
          {/* Free Tier */}
          <div className="flex min-w-[320px] max-w-[448px] grow shrink-0 basis-0 flex-col items-start gap-8 rounded-2xl border-2 border-solid border-[var(--card-border)] bg-[var(--card-bg)] px-8 py-8 transition-colors duration-300">
            <div className="flex w-full flex-col items-start gap-6">
              <div className="flex w-full flex-col items-start gap-2">
                <h3 className="w-full font-[var(--font-geist-sans)] text-[24px] font-bold leading-[28px] text-[var(--foreground)]">
                  Free
                </h3>
                <div className="flex gap-1 items-baseline">
                  <span className="font-[var(--font-geist-sans)] text-[48px] font-bold leading-[52px] text-[var(--foreground)] -tracking-[0.04em]">
                    €0
                  </span>
                  <span className="font-[var(--font-merriweather)] text-[18px] font-[400] leading-[26px] text-[var(--foreground)] opacity-70">
                    /month
                  </span>
                </div>
                <p className="w-full font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-[var(--foreground)] opacity-70">
                  Perfect for testing the waters and small projects.
                </p>
              </div>
              <div className="flex w-full flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  <FeatherCheck className="text-heading-3 font-heading-3 text-success-600" />
                  <span className="font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-[var(--foreground)]">
                    50 signups per month
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FeatherCheck className="text-heading-3 font-heading-3 text-success-600" />
                  <span className="font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-[var(--foreground)]">
                    AI-powered scoring
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FeatherCheck className="text-heading-3 font-heading-3 text-success-600" />
                  <span className="font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-[var(--foreground)]">
                    1 waitlist
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FeatherCheck className="text-heading-3 font-heading-3 text-success-600" />
                  <span className="font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-[var(--foreground)]">
                    Basic analytics
                  </span>
                </div>
              </div>
            </div>
            <Link href="/login" className="w-full">
              <Button
                className="h-10 w-full flex-none font-[var(--font-geist-sans)] font-bold"
                variant="brand-secondary"
                size="large"
              >
                Get started
              </Button>
            </Link>
          </div>
          {/* Pro Tier */}
          <div className="flex min-w-[320px] max-w-[448px] grow shrink-0 basis-0 flex-col items-start gap-8 rounded-2xl border-2 border-solid border-brand-600 bg-[var(--card-bg)] px-8 py-8 transition-colors duration-300">
            <div className="flex w-full flex-col items-start gap-6">
              <div className="flex w-full items-center justify-between">
                <h3 className="font-[var(--font-geist-sans)] text-[24px] font-bold leading-[28px] text-[var(--foreground)]">
                  Pro
                </h3>
                <Badge variant="brand">Popular</Badge>
              </div>
              <div className="flex w-full flex-col items-start gap-2">
                <div className="flex gap-1 items-baseline">
                  <span className="font-[var(--font-geist-sans)] text-[48px] font-bold leading-[52px] text-[var(--foreground)] -tracking-[0.04em]">
                    €29
                  </span>
                  <span className="font-[var(--font-merriweather)] text-[18px] font-[400] leading-[26px] text-[var(--foreground)] opacity-70">
                    /month
                  </span>
                </div>
                <p className="w-full font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-[var(--foreground)] opacity-70">
                  For serious launches that need serious firepower.
                </p>
              </div>
              <div className="flex w-full flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  <FeatherCheck className="text-heading-3 font-heading-3 text-success-600" />
                  <span className="font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-[var(--foreground)]">
                    1,000 signups per month
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FeatherCheck className="text-heading-3 font-heading-3 text-success-600" />
                  <span className="font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-[var(--foreground)]">
                    AI-powered scoring
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FeatherCheck className="text-heading-3 font-heading-3 text-success-600" />
                  <span className="font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-[var(--foreground)]">
                    Unlimited waitlists
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FeatherCheck className="text-heading-3 font-heading-3 text-success-600" />
                  <span className="font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-[var(--foreground)]">
                    Priority support
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FeatherCheck className="text-heading-3 font-heading-3 text-success-600" />
                  <span className="font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-[var(--foreground)]">
                    Custom branding
                  </span>
                </div>
              </div>
            </div>
            <Link href="/login" className="w-full">
              <Button
                className="h-10 w-full flex-none font-[var(--font-geist-sans)] font-bold"
                variant="brand-primary"
                size="large"
              >
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex w-full flex-col items-center justify-center bg-[var(--background)] px-6 py-12 transition-colors duration-300">
        <div className="flex w-full max-w-[1024px] flex-col items-center gap-4">
          <span className="font-[var(--font-bagel-fat-one)] text-[24px] font-[400] leading-[28px] text-[var(--foreground)]">
            🎣 BaitList
          </span>
          <p className="font-[var(--font-merriweather)] text-[14px] font-[400] leading-[20px] text-[var(--foreground)] opacity-70 text-center">
            © {new Date().getFullYear()} BaitList — only the best bites.
          </p>
        </div>
      </div>
    </div>
  );
}
