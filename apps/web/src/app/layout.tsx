import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://redistribut.com"),
  title: "ReDist | Redistribute surplus inventory",
  description: "ReDist helps organizations redistribute excess, near-expiry, and slow-moving stock before it becomes waste.",
  applicationName: "ReDist",
  keywords: [
    "Redistribut",
    "ReDist",
    "surplus inventory",
    "circular economy",
    "waste reduction",
    "inventory exchange",
    "near expiry stock",
  ],
  authors: [{ name: "Redistribut" }],
  creator: "Redistribut",
  publisher: "Redistribut",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://redistribut.com",
    siteName: "ReDist",
    title: "ReDist | Redistribute surplus inventory",
    description: "Move excess, near-expiry, and slow-moving stock to organizations that can use it.",
    images: [
      {
        url: "/brand/redistribut-mark.png",
        width: 150,
        height: 136,
        alt: "ReDist brand mark",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "ReDist | Redistribute surplus inventory",
    description: "Move excess, near-expiry, and slow-moving stock before it becomes waste.",
    images: ["/brand/redistribut-mark.png"],
  },
  icons: {
    icon: "/brand/redistribut-mark.png",
    apple: "/brand/redistribut-mark.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
