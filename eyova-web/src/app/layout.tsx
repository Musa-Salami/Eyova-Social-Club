import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Eyova Social Club",
    template: "%s · Eyova Social Club",
  },
  description:
    "Eyova Social Club - Ebira Youths One Voice Association Abuja. Interactive nonprofit platform for events, members, and community activities.",
  icons: {
    icon: "/eyova-logo.jpg",
    apple: "/eyova-logo.jpg",
  },
  openGraph: {
    title: "Eyova Social Club",
    description:
      "Ebira Youths One Voice Association Abuja - events, members, and community activities.",
    siteName: "Eyova Social Club",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#102740",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-950 text-slate-100">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
