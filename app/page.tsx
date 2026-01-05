"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/ui/components/Button";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { Badge } from "@/ui/components/Badge";
import { FeatherCheck, FeatherCpu, FeatherZap, FeatherShare2 } from "@subframe/core";

export default function LandingPage() {
  return (
    <div className="flex w-full flex-col items-center bg-default-background">
      {/* Hero Section */}
      <div className="flex w-full flex-col items-center justify-center gap-8 bg-brand-600 px-6 py-32 mobile:px-6 mobile:py-24">
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
                variant="inverse"
                size="large"
                className="font-[var(--font-geist-sans)] font-bold"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="flex w-full flex-col items-center justify-center gap-12 bg-default-background px-6 py-24">
        <div className="flex w-full max-w-[1024px] flex-col items-center gap-4">
          <h2 className="font-[var(--font-geist-sans)] text-[40px] font-bold leading-[44px] text-default-font text-center -tracking-[0.02em]">
            Smart waitlists, real results
          </h2>
          <p className="max-w-[576px] font-[var(--font-merriweather)] text-[18px] font-[400] leading-[28px] text-subtext-color text-center">
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
              <h3 className="w-full font-[var(--font-geist-sans)] text-[24px] font-bold leading-[28px] text-default-font text-center">
                AI-Powered Scoring
              </h3>
              <p className="w-full whitespace-pre-wrap font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-subtext-color text-center">
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
              <h3 className="w-full font-[var(--font-geist-sans)] text-[24px] font-bold leading-[28px] text-default-font text-center">
                Auto-Approval
              </h3>
              <p className="w-full whitespace-pre-wrap font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-subtext-color text-center">
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
              <h3 className="w-full font-[var(--font-geist-sans)] text-[24px] font-bold leading-[28px] text-default-font text-center">
                Gamification
              </h3>
              <p className="w-full whitespace-pre-wrap font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-subtext-color text-center">
                Share to move up the queue. Turn waitlists into viral growth engines.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="flex w-full flex-col items-center justify-center gap-12 bg-neutral-50 px-6 py-24">
        <div className="flex w-full max-w-[1024px] flex-col items-center gap-4">
          <h2 className="font-[var(--font-geist-sans)] text-[40px] font-bold leading-[44px] text-default-font text-center -tracking-[0.02em]">
            Simple, transparent pricing
          </h2>
          <p className="max-w-[576px] font-[var(--font-merriweather)] text-[18px] font-[400] leading-[28px] text-subtext-color text-center">
            Start free. Upgrade when you need more.
          </p>
        </div>
        <div className="flex w-full max-w-[1024px] flex-wrap items-start justify-center gap-8">
          {/* Free Tier */}
          <div className="flex min-w-[320px] max-w-[448px] grow shrink-0 basis-0 flex-col items-start gap-8 rounded-2xl border-2 border-solid border-neutral-border bg-white px-8 py-8">
            <div className="flex w-full flex-col items-start gap-6">
              <div className="flex w-full flex-col items-start gap-2">
                <h3 className="w-full font-[var(--font-geist-sans)] text-[24px] font-bold leading-[28px] text-default-font">
                  Free
                </h3>
                <div className="flex gap-1 items-baseline">
                  <span className="font-[var(--font-geist-sans)] text-[48px] font-bold leading-[52px] text-default-font -tracking-[0.04em]">
                    €0
                  </span>
                  <span className="font-[var(--font-merriweather)] text-[18px] font-[400] leading-[26px] text-subtext-color">
                    /month
                  </span>
                </div>
                <p className="w-full font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-subtext-color">
                  Perfect for testing the waters and small projects.
                </p>
              </div>
              <div className="flex w-full flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  <FeatherCheck className="text-heading-3 font-heading-3 text-success-600" />
                  <span className="font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-default-font">
                    50 signups per month
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FeatherCheck className="text-heading-3 font-heading-3 text-success-600" />
                  <span className="font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-default-font">
                    AI-powered scoring
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FeatherCheck className="text-heading-3 font-heading-3 text-success-600" />
                  <span className="font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-default-font">
                    1 waitlist
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FeatherCheck className="text-heading-3 font-heading-3 text-success-600" />
                  <span className="font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-default-font">
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
          <div className="flex min-w-[320px] max-w-[448px] grow shrink-0 basis-0 flex-col items-start gap-8 rounded-2xl border-2 border-solid border-brand-600 bg-white px-8 py-8">
            <div className="flex w-full flex-col items-start gap-6">
              <div className="flex w-full items-center justify-between">
                <h3 className="font-[var(--font-geist-sans)] text-[24px] font-bold leading-[28px] text-default-font">
                  Pro
                </h3>
                <Badge variant="brand">Popular</Badge>
              </div>
              <div className="flex w-full flex-col items-start gap-2">
                <div className="flex gap-1 items-baseline">
                  <span className="font-[var(--font-geist-sans)] text-[48px] font-bold leading-[52px] text-default-font -tracking-[0.04em]">
                    €29
                  </span>
                  <span className="font-[var(--font-merriweather)] text-[18px] font-[400] leading-[26px] text-subtext-color">
                    /month
                  </span>
                </div>
                <p className="w-full font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-subtext-color">
                  For serious launches that need serious firepower.
                </p>
              </div>
              <div className="flex w-full flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  <FeatherCheck className="text-heading-3 font-heading-3 text-success-600" />
                  <span className="font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-default-font">
                    1,000 signups per month
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FeatherCheck className="text-heading-3 font-heading-3 text-success-600" />
                  <span className="font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-default-font">
                    AI-powered scoring
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FeatherCheck className="text-heading-3 font-heading-3 text-success-600" />
                  <span className="font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-default-font">
                    Unlimited waitlists
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FeatherCheck className="text-heading-3 font-heading-3 text-success-600" />
                  <span className="font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-default-font">
                    Priority support
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FeatherCheck className="text-heading-3 font-heading-3 text-success-600" />
                  <span className="font-[var(--font-merriweather)] text-[16px] font-[400] leading-[26px] text-default-font">
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
      <div className="flex w-full flex-col items-center justify-center bg-default-background px-6 py-12">
        <div className="flex w-full max-w-[1024px] flex-col items-center gap-4">
          <span className="font-[var(--font-bagel-fat-one)] text-[24px] font-[400] leading-[28px] text-default-font">
            🎣 BaitList
          </span>
          <p className="font-[var(--font-merriweather)] text-[14px] font-[400] leading-[20px] text-subtext-color text-center">
            © {new Date().getFullYear()} BaitList — only the best bites.
          </p>
        </div>
      </div>
    </div>
  );
}
