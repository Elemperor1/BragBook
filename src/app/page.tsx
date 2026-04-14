import type { Metadata } from "next";
import { LandingPage } from "@/components/marketing/landing-page";

export const metadata: Metadata = {
  title: "Keep the proof behind the work that should advance your career",
  description:
    "Capture wins while the details are fresh, then turn them into promotion packets, self-reviews, resume bullets, and interview stories.",
};

export default function Home() {
  return <LandingPage />;
}
