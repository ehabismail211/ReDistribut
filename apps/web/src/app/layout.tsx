import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://redistribut.com"),
  title: {
    default: "ReDist | Trusted surplus redistribution for UAE organizations",
    template: "%s | ReDist",
  },
  description: "ReDist helps verified UAE organizations move usable surplus from listing to request, handover, certificate, and impact tracking.",
  applicationName: "ReDist",
  keywords: [
    "Redistribut",
    "ReDist",
    "surplus redistribution UAE",
    "circular economy UAE",
    "verified resource redistribution",
    "surplus resource handover",
    "ESG redistribution evidence",
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
    title: "ReDist | Trusted surplus redistribution for UAE organizations",
    description: "Move usable surplus through verified organization workflows with handover evidence and impact visibility.",
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
    title: "ReDist | Trusted surplus redistribution for UAE organizations",
    description: "Move usable surplus through verified organization workflows with handover evidence and impact visibility.",
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
