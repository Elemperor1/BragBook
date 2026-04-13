"use client";

import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SidebarNav } from "@/components/layout/sidebar-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-[1560px]">
        <SidebarNav pathname={pathname} />
        <div className="flex min-h-screen flex-1 flex-col px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-6">
          <main className="flex-1">{children}</main>
        </div>
      </div>
      <MobileNav pathname={pathname} />
    </div>
  );
}
