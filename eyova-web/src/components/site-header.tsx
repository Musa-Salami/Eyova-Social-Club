"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type SVGProps } from "react";

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

const navLinks: { href: string; label: string; Icon: NavIcon }[] = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/what-we-do", label: "What we do", Icon: SparklesIcon },
  { href: "/members", label: "Members", Icon: UsersIcon },
  { href: "/donate", label: "Donate", Icon: HeartIcon },
];

function isActive(pathname: string | null, href: string) {
  if (href === "/") return pathname === "/";
  return pathname?.startsWith(href) ?? false;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-cyan-300/20 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 md:h-16 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/eyova-logo.jpg"
            alt="Eyova Social Club logo"
            width={34}
            height={34}
            className="h-8 w-8 rounded-lg border border-cyan-300/25 md:h-9 md:w-9"
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
          className="ml-auto hidden items-center gap-1 rounded-full border border-cyan-200/15 bg-slate-950/60 p-1 text-xs md:inline-flex"
        >
          {navLinks.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-1.5 font-semibold transition ${
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
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((prev) => !prev)}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200/25 bg-slate-900/60 text-cyan-100 transition hover:border-amber-300/60 hover:text-amber-200 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close menu overlay"
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-14 z-30 cursor-default bg-slate-950/70 backdrop-blur-sm md:hidden"
          />
          <nav
            id="mobile-nav"
            aria-label="Mobile"
            className="absolute inset-x-0 top-14 z-40 border-b border-cyan-300/20 bg-slate-950/95 shadow-2xl shadow-slate-950/70 md:hidden"
          >
            <ul className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-3">
              {navLinks.map(({ href, label, Icon }) => {
                const active = isActive(pathname, href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                        active
                          ? "border-amber-300/60 bg-amber-400/15 text-amber-200"
                          : "border-cyan-200/10 bg-slate-900/40 text-slate-200 hover:border-cyan-200/40 hover:text-white"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                          active
                            ? "border-amber-300/50 bg-amber-400/10 text-amber-200"
                            : "border-cyan-200/15 bg-slate-950/60 text-cyan-200"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="flex-1">{label}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 opacity-70"
                        aria-hidden="true"
                      >
                        <path d="M9 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      ) : null}
    </header>
  );
}
