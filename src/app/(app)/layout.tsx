import { AppBootstrap } from "@/components/layout/app-bootstrap";
import { AppShell } from "@/components/layout/app-shell";

export default function ProductAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppBootstrap />
      <AppShell>{children}</AppShell>
    </>
  );
}
