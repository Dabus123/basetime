import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BaseTime - Onchain Social Calendar",
  description: "Discover, create, and share events in the Base ecosystem. RSVP to events and mint Event Pass NFTs as proof of attendance.",
  keywords: ["calendar", "events", "social", "onchain", "base", "nft", "rsvp"],
  authors: [{ name: "BaseTime Team" }],
  openGraph: {
    title: "BaseTime - Onchain Social Calendar",
    description: "Discover, create, and share events in the Base ecosystem. RSVP to events and mint Event Pass NFTs as proof of attendance.",
    type: "website",
    locale: "en_US",
    siteName: "BaseTime",
  },
  twitter: {
    card: "summary_large_image",
    title: "BaseTime - Onchain Social Calendar",
    description: "Discover, create, and share events in the Base ecosystem. RSVP to events and mint Event Pass NFTs as proof of attendance.",
  },
  robots: {
    index: false, // Set to true when ready for production
    follow: false,
  },
  other: {
    "fc:miniapp": JSON.stringify({
      version: "next",
      imageUrl: "https://basetime.vercel.app/hero.png",
      button: {
        title: "Join BaseTime",
        action: {
          type: "launch_frame",
          name: "Launch BaseTime",
          url: "https://basetime.vercel.app",
          splashImageUrl: "https://basetime.vercel.app/splash.png",
          splashBackgroundColor: "#1e40af",
        },
      },
    }),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
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
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
