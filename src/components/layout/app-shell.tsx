"use client";

import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { navigationItems } from "@/components/layout/nav-items";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeItem =
    navigationItems.find((item) => pathname === item.href) ??
    navigationItems.find((item) => pathname.startsWith(item.href) && item.href !== "/dashboard") ??
    navigationItems[0];

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-[1560px]">
        <SidebarNav pathname={pathname} />
        <div className="flex min-h-screen flex-1 flex-col px-4 pb-28 pt-4 sm:px-6 lg:px-8 lg:pb-10 lg:pt-6">
          <div className="shell-panel mb-5 rounded-[1.5rem] border border-white/80 px-5 py-4 lg:hidden">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              BragBook
            </p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <div>
                <p className="text-xl font-semibold tracking-tight text-foreground">
                  {activeItem.label}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {activeItem.description}
                </p>
              </div>
              <div className="rounded-full bg-accent-soft px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] text-foreground">
                Local
              </div>
            </div>
          </div>

          <main className="flex-1">{children}</main>
        </div>
      </div>
      <MobileNav pathname={pathname} />
    </div>
  );
}
