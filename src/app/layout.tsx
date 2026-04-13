import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { AppBootstrap } from "@/components/layout/app-bootstrap";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BragBook",
    template: "%s | BragBook",
  },
  description:
    "A local-first evidence vault for software engineers to capture wins, proof, and promotion-ready stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full">
        <AppBootstrap />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
