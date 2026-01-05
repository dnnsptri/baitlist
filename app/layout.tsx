import type { Metadata } from "next";
import { Geist, Merriweather, Bagel_Fat_One } from "next/font/google";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${merriweather.variable} ${bagelFatOne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
