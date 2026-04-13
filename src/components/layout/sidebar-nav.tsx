"use client";

import Link from "next/link";
import { navigationItems } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils/cn";

export function SidebarNav({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden w-[308px] shrink-0 px-6 py-6 lg:block">
      <div className="shell-panel sticky top-6 flex min-h-[calc(100vh-3rem)] flex-col rounded-[2rem] border border-white/75 px-6 py-7">
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-accent text-lg font-semibold text-accent-foreground">
              BB
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold tracking-tight text-foreground">
                BragBook
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                Proof for reviews, promotions, and interviews, stored only in this browser.
              </p>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-white/70 p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              Operating mode
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground">
              Quiet by default. Sharp when you need it. Stored only in this browser unless you export a backup.
            </p>
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {navigationItems.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/entries" && pathname.startsWith("/entries/") && pathname !== "/entries/new");

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-start gap-4 rounded-[1.5rem] px-4 py-4 transition",
                  isActive
                    ? "bg-white text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:bg-white/55 hover:text-foreground",
                )}
              >
                <span className="mt-0.5 font-mono text-xs tracking-[0.24em] text-muted-foreground">
                  0{index + 1}
                </span>
                <span className="space-y-1">
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="block text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-[1.5rem] border border-border/70 bg-white/50 p-4">
          <p className="text-sm font-medium text-foreground">Built for serious evidence capture</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Keep the raw context now so future review writing becomes synthesis instead of archaeology.
          </p>
        </div>
      </div>
    </aside>
  );
}
