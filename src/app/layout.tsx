import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://thebait.space"),

  title: {
    default: "The Bait — Nations Have No Friends, Only Interests",
    template: "%s | The Bait",
  },

  applicationName: "The Bait",

  description:
    "No Permanent Friends. No Permanent Enemies. Only Permanent Interests.",

  alternates: {
    canonical: "https://thebait.space",
  },

  openGraph: {
    type: "website",
    url: "https://thebait.space",
    title: "The Bait — Nations Have No Friends, Only Interests",
    description:
      "No Permanent Friends. No Permanent Enemies. Only Permanent Interests.",
    siteName: "The Bait",
    images: [
      {
        url: "/image/the-bait-logo-mark-512copy.png",
        width: 512,
        height: 512,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "The Bait — Where the World Gets Argued",
    description:
      "A dedicated community for geopolitics.",
    images: ["/image/the-bait-logo-mark-512copy.png"],
  },

  icons: {
    icon: "/image/favicon.ico",
    shortcut: "/image/favicon.ico",
    apple: "/image/the-bait-logo-mark-512copy.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col bg-[#F5F5F5] text-ink antialiased">
        <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "The Bait",
      alternateName: ["TheBait", "thebait.space"],
      url: "https://thebait.space",
    }),
  }}
/>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}