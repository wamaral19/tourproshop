import type { Metadata } from "next";
import { Gemunu_Libre } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { SiteChrome } from "@/components/site-chrome";

const switzer = localFont({
  variable: "--font-switzer",
  display: "swap",
  src: [
    {
      path: "./fonts/Switzer-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./fonts/Switzer-VariableItalic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
});

const gemunu = Gemunu_Libre({
  variable: "--font-gemunu",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tour Pro Shop — Looks from Inside the Ropes",
    template: "%s | Tour Pro Shop",
  },
  description:
    "Bringing you looks from inside the ropes. Heritage golf apparel, gear, and stories from the world's best.",
  metadataBase: new URL("https://tourpro.shop"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${switzer.variable} ${gemunu.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-brand-cream text-brand-ink">
        <CartProvider>
          <SiteChrome>{children}</SiteChrome>
        </CartProvider>
      </body>
    </html>
  );
}
