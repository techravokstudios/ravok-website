import type { Metadata } from "next";
import { Cormorant_Garamond, Kanit, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";
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
  title: "Ravok Studios",
  description: "A New Architecture for Entertainment",
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
