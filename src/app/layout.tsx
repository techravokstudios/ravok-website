import type { Metadata } from "next";
import { Cormorant_Garamond, Kanit, Instrument_Sans } from "next/font/google";
import "@/styles/globals.css";
import { CustomCursor } from "@/components/shared/CustomCursor";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ravok.co"),
  title: {
    default: "RAVOK Studios | Venture Studio for Film & Entertainment",
    template: "%s | RAVOK Studios",
  },
  description:
    "RAVOK Studios structures film and entertainment projects as venture-backed companies where creators keep equity, ownership, and governance rights.",
  keywords: [
    "RAVOK Studios",
    "film venture studio",
    "creator ownership",
    "SPV film financing",
    "entertainment startup studio",
    "film production company",
  ],
  openGraph: {
    title: "RAVOK Studios | A New Architecture for Entertainment",
    description:
      "We back creators like founders—funding projects as ventures with real equity and transparent governance.",
    url: "https://www.ravok.co",
    siteName: "RAVOK Studios",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RAVOK Studios",
    description:
      "A venture studio for entertainment where creators keep ownership and upside.",
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
        className={`${cormorant.variable} ${kanit.variable} ${instrument.variable} antialiased bg-black text-white cursor-none`}
      >
        <CustomCursor />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: "!bg-white/10 !border-white/20 !text-white backdrop-blur-xl",
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
