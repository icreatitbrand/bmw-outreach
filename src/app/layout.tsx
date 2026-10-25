import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { ConvexProviderBoundary } from "@/components/convex-provider";
import { SITE, SITE_URL } from "@/lib/site";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} — God is your business partner.`,
    template: `%s — ${SITE.shortName}`,
  },
  description:
    "A free, faith-centered business fellowship for student entrepreneurs, business owners, and professionals. Join online — in-person meetings coming soon.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE.name,
    title: `${SITE.name} — God is your business partner.`,
    description:
      "A free, faith-centered business fellowship for student entrepreneurs, business owners, and professionals. Starting online — in-person meetings coming soon.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — God is your business partner.`,
    description:
      "A free, faith-centered business fellowship for student entrepreneurs, business owners, and professionals.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${dmSans.variable} font-sans antialiased`}
      >
        <ConvexProviderBoundary>{children}</ConvexProviderBoundary>
      </body>
    </html>
  );
}
