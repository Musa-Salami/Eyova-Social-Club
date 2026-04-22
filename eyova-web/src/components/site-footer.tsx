import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-cyan-300/15 bg-slate-950/90">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <div className="flex items-start gap-3">
          <Image
            src="/eyova-logo.jpg"
            alt="Eyova logo"
            width={48}
            height={48}
            className="rounded-xl border border-cyan-300/25"
          />
          <div>
            <p className="text-sm font-semibold text-cyan-200">
              Eyova Social Club
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Ebira Youths One Voice Association Abuja
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
            Explore
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>
              <Link href="/" className="hover:text-cyan-200">
                Home
              </Link>
            </li>
            <li>
              <Link href="/what-we-do" className="hover:text-cyan-200">
                What we do
              </Link>
            </li>
            <li>
              <Link href="/members" className="hover:text-cyan-200">
                Members
              </Link>
            </li>
            <li>
              <Link href="/donate" className="hover:text-cyan-200">
                Donate
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
            Connect
          </p>
          <p className="mt-3 text-sm text-slate-300">
            For partnerships, collaborations, or to join our community,
            reach out anytime.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <a
              href="mailto:eyovaclub@gmail.com"
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/30 px-3 py-1.5 text-xs text-cyan-200 hover:bg-cyan-300/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3.5 6 8.5 7 8.5-7" />
              </svg>
              eyovaclub@gmail.com
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100086977344332"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Eyova Social Club on Facebook"
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/30 px-3 py-1.5 text-xs text-cyan-200 transition hover:border-amber-300/60 hover:bg-amber-300/10 hover:text-amber-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.7V4.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4V14h2.7v8h3.4Z" />
              </svg>
              Facebook
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-cyan-300/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col-reverse items-start gap-3 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <p className="text-[11px] sm:text-xs">
            © {new Date().getFullYear()} Eyova Social Club. All rights
            reserved.
          </p>
          <Link
            href="/admin/login"
            aria-label="Admin login"
            title="Admin login"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/20 text-slate-400 transition hover:border-amber-300/50 hover:text-amber-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 1 1 8 0v4" />
              <circle cx="12" cy="16" r="1.2" fill="currentColor" stroke="none" />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}
