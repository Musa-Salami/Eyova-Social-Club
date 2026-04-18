import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-20 text-center md:px-6 md:py-28">
      <Image
        src="/eyova-logo.jpg"
        alt="Eyova Social Club logo"
        width={72}
        height={72}
        className="rounded-2xl border border-cyan-300/30"
      />
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
        Page not found
      </p>
      <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
        Looks like you&apos;ve taken a detour.
      </h1>
      <p className="mt-4 max-w-xl text-slate-300">
        The page you were looking for has moved or never existed. Use the
        links below to get back on track.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/30 hover:bg-amber-300"
        >
          Back to Home
        </Link>
        <Link
          href="/what-we-do"
          className="rounded-full border border-cyan-200/40 bg-white/5 px-6 py-3 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/10"
        >
          What we do
        </Link>
        <Link
          href="/members"
          className="rounded-full border border-cyan-200/40 bg-white/5 px-6 py-3 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/10"
        >
          Members
        </Link>
        <Link
          href="/donate"
          className="rounded-full border border-cyan-200/40 bg-white/5 px-6 py-3 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/10"
        >
          Donate
        </Link>
      </div>
    </section>
  );
}
