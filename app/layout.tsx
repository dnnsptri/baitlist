import type { Metadata } from "next";
import { Geist, Merriweather, Bagel_Fat_One } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const bagelFatOne = Bagel_Fat_One({
  variable: "--font-bagel-fat-one",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Baitlist - for people who want serious bites",
  description: "Baitlist is a platform for people who want serious bites. It's a platform for people who want to build a waitlist for a product or service. It's a platform for people who want to build a waitlist for a product or service. It's a platform for people who want to build a waitlist for a product or service.",
};

// Script to prevent flash of wrong theme - runs before React hydrates
const themeScript = `
  (function() {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${merriweather.variable} ${bagelFatOne.variable} antialiased`}
      >
        {/* Google Analytics */}
        {/*<Script
          src="https://www.googletagmanager.com/gtag/js?id=G-E88E0C22F8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E88E0C22F8');
          `}
        </Script>*/} 
        {children}
      </body>
    </html>
  );
}
