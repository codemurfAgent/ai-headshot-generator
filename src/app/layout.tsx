import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Headshot Generator | Professional Headshots in 30 Seconds",
  description: "Turn any selfie into a professional headshot instantly. Get 4 studio-quality headshots for just $19. Perfect for LinkedIn, resumes, and professional profiles.",
  keywords: ["AI headshot", "professional photo", "LinkedIn photo", "headshot generator", "AI photo"],
  openGraph: {
    title: "AI Headshot Generator",
    description: "Professional headshots in 30 seconds for $19",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
