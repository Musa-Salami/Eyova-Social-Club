"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/what-we-do", label: "What we do" },
  { href: "/members", label: "Members" },
  { href: "/donate", label: "Donate" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-cyan-300/20 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-3 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/eyova-logo.jpg"
            alt="Eyova Social Club logo"
            width={34}
            height={34}
            className="rounded-lg border border-cyan-300/25"
          />
          <span className="hidden text-sm font-semibold tracking-wide text-cyan-200 sm:inline">
            EYOVA SOCIAL CLUB
          </span>
          <span className="text-sm font-semibold tracking-wide text-cyan-200 sm:hidden">
            EYOVA
          </span>
        </Link>
        <nav
          aria-label="Primary"
          className="scrollbar-none ml-auto inline-flex flex-wrap items-center overflow-x-auto rounded-full border border-cyan-200/15 bg-slate-950/60 p-1 text-xs"
        >
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 font-semibold transition ${
                  active
                    ? "bg-amber-400 text-slate-950"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
