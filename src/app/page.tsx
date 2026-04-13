import type { Metadata } from "next";
import { LandingPage } from "@/components/marketing/landing-page";

export const metadata: Metadata = {
  title: "Capture proof before review season does the remembering",
  description:
    "Your career wins are too valuable to forget. Capture proof of your work and turn it into polished self-reviews, resume bullets, and interview stories.",
};

export default function Home() {
  return <LandingPage />;
}
