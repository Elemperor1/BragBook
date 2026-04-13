import type { Metadata } from "next";
import { GeneratorPage } from "@/components/generator/generator-page";

export const metadata: Metadata = {
  title: "Generator",
};

export default function GeneratorRoute() {
  return <GeneratorPage />;
}
