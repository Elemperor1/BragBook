import type { Metadata } from "next";
import { LandingPage } from "@/components/marketing/landing-page";

export const metadata: Metadata = {
  title: "Turn your best work into career leverage",
  description:
    "Capture proof while the details are fresh, then turn it into promotion packets, self-reviews, resume bullets, and interview stories from evidence you own.",
  openGraph: {
    title: "BragBook - Turn your best work into career leverage",
    description:
      "Capture proof while the details are fresh, then turn it into serious career documents from evidence you own.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BragBook - Turn your best work into career leverage",
    description:
      "Capture proof while the details are fresh, then turn it into serious career documents from evidence you own.",
  },
};

export default function Home() {
  return <LandingPage />;
}
