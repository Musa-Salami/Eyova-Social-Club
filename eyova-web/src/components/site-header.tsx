"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SVGProps } from "react";

type NavIcon = (props: SVGProps<SVGSVGElement>) => React.ReactElement;

const HomeIcon: NavIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
  </svg>
);

const SparklesIcon: NavIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M12 3v4" />
    <path d="M12 17v4" />
    <path d="M4.5 12H8" />
    <path d="M16 12h3.5" />
    <path d="m6.5 6.5 2.2 2.2" />
    <path d="m15.3 15.3 2.2 2.2" />
    <path d="m6.5 17.5 2.2-2.2" />
    <path d="m15.3 8.7 2.2-2.2" />
  </svg>
);

const UsersIcon: NavIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c.8-3.2 3.4-5 6-5s4.8 1.5 5.6 4" />
    <circle cx="17" cy="9" r="2.6" />
    <path d="M15.5 14.2c2.9.2 4.7 1.9 5.5 4.8" />
  </svg>
);

const HeartIcon: NavIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M12 20s-7-4.35-9.2-8.6C1.3 8 3.4 4.5 6.8 4.5c2 0 3.4 1 5.2 3 1.8-2 3.2-3 5.2-3 3.4 0 5.5 3.5 4 6.9C19 15.65 12 20 12 20Z" />
  </svg>
);

const navLinks: {
  href: string;
  label: string;
  description: string;
  Icon: NavIcon;
}[] = [
  {
    href: "/",
    label: "Home",
    description: "Welcome & overview",
    Icon: HomeIcon,
  },
  {
    href: "/what-we-do",
    label: "What we do",
    description: "Programs & impact",
    Icon: SparklesIcon,
  },
  {
    href: "/members",
    label: "Members",
    description: "Our community",
    Icon: UsersIcon,
  },
  {
    href: "/donate",
    label: "Donate",
    description: "Support our mission",
    Icon: HeartIcon,
  },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-cyan-300/20 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center gap-3 px-3 py-2 md:px-6">
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
          className="scrollbar-none ml-auto inline-flex flex-wrap items-center gap-1 overflow-x-auto rounded-2xl border border-cyan-200/15 bg-slate-950/60 p-1 text-xs"
        >
          {navLinks.map(({ href, label, description, Icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-label={`${label} – ${description}`}
                className={`group flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-1.5 font-semibold transition ${
                  active
                    ? "bg-amber-400 text-slate-950"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    active ? "text-slate-950" : "text-cyan-300"
                  }`}
                />
                <span className="flex flex-col leading-tight">
                  <span>{label}</span>
                  <span
                    className={`hidden text-[10px] font-medium tracking-wide sm:inline ${
                      active ? "text-slate-900/80" : "text-slate-400"
                    }`}
                  >
                    {description}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
