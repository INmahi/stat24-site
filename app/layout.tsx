import type { Metadata } from "next";
import { Titillium_Web, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { ParticleBackground } from "@/components/particle-background";
import { CustomCursor } from "@/components/custom-cursor";
import { ClickSpill } from "@/components/click-spill";
import { ChatPanel } from "@/components/chat-panel";

const titillium = Titillium_Web({
  variable: "--font-titillium",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IRIS 34 — SUST Statistics",
  description:
    "Batch 34 of SUST Department of Statistics · curriculum, GPA calculator, and AI academic advisor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${titillium.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ParticleBackground />
        <SiteNav />
        {children}
        <ChatPanel />
        <ClickSpill />
        <CustomCursor />
      </body>
    </html>
  );
}
