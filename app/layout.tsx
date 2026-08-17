import type { Metadata } from "next";
import { Gemunu_Libre } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { SiteChrome } from "@/components/site-chrome";
import { MetaPixelEvents } from "@/components/meta-pixel-events";
import { SITE_PREVIEW } from "@/lib/site-mode";

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
    default: "Tour Pro Shop — From your favorite tour pro to you.",
    template: "%s | Tour Pro Shop",
  },
  description:
    "From your favorite tour pro to you. Heritage golf apparel, gear, and stories from the world's best.",
  metadataBase: new URL("https://tourpro.shop"),
  // The password-gated preview answers 401 to anything without credentials, so
  // a crawler never gets this far. Stated anyway, in case the gate is ever
  // lifted before the site is meant to be public.
  ...(SITE_PREVIEW ? { robots: { index: false, follow: false } } : {}),
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
        {/* Meta Pixel — inline so it renders verbatim into the server HTML
            (guaranteed detectable by Meta, regardless of hydration timing).
            Client-side route-change PageViews are handled by <MetaPixelEvents />.

            Off on the password-gated preview. Only we can reach that site, and
            its PageViews and test signups would land in the same pixel as the
            real campaigns and pollute the Lead conversion we optimize on. */}
        {SITE_PREVIEW ? null : (
          <>
            <script
              id="meta-pixel"
              dangerouslySetInnerHTML={{
                __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1027337640179210');
fbq('track', 'PageView');`,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src="https://www.facebook.com/tr?id=1027337640179210&ev=PageView&noscript=1"
                alt=""
              />
            </noscript>
            <MetaPixelEvents />
          </>
        )}
        <CartProvider>
          <SiteChrome>{children}</SiteChrome>
        </CartProvider>
      </body>
    </html>
  );
}
