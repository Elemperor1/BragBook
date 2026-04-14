"use client";

import Link from "next/link";
import { navigationItems } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils/cn";

export function MobileNav({ pathname }: { pathname: string }) {
  return (
    <nav className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-[calc(100%-1.5rem)] max-w-xl items-center justify-between rounded-[1.5rem] border border-white/80 bg-[rgba(250,246,240,0.88)] px-3 py-3 shadow-[0_18px_40px_rgba(43,34,24,0.16)] backdrop-blur xl:hidden">
      {navigationItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href === "/entries" && pathname.startsWith("/entries/") && pathname !== "/entries/new");

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-1 items-center justify-center rounded-[1rem] px-2 py-2 text-xs font-medium transition",
              isActive
                ? "bg-ink text-ink-foreground shadow-[var(--shadow-card)]"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
            )}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.2em]">
              {item.shortLabel}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
