"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const amounts = [
  { value: "5,000", label: "Supporter" },
  { value: "10,000", label: "Friend" },
  { value: "25,000", label: "Patron" },
  { value: "50,000", label: "Champion" },
  { value: "100,000", label: "Benefactor" },
  { value: "Custom", label: "Any amount" },
];

const bankDetails = {
  bankName: "Access Bank",
  accountName: "Eyova Social Club",
  accountNumber: "0123456789",
  currency: "NGN",
};

const impactAreas = [
  {
    title: "Community Outreach",
    copy: "Fund mentorship visits, school programs, and civic-awareness drives across Abuja.",
    accent: "text-amber-300",
  },
  {
    title: "Culture & Heritage",
    copy: "Preserve Ebira heritage through cultural events, storytelling, and annual showcases.",
    accent: "text-cyan-300",
  },
  {
    title: "Youth Empowerment",
    copy: "Support scholarships, leadership training, and career mentorship for our youths.",
    accent: "text-amber-300",
  },
];

const otherWays = [
  {
    title: "Volunteer",
    copy: "Give your time and skills to our outreach programs and events.",
  },
  {
    title: "Partner",
    copy: "Organisations and alumni networks can co-host events or sponsor initiatives.",
  },
  {
    title: "In-Kind Gifts",
    copy: "Donate equipment, venues, or services instead of cash.",
  },
];

export default function DonatePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ImpactGrid />
      <AmountsAndBank />
      <OtherWays />
      <FinalCTA />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-cyan-300/10">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=1920&q=80"
          alt="Hands joined in unity"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/80 to-cyan-950/80" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-24">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
            Support Our Mission
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            Your donation keeps our community moving forward.
          </h1>
          <p className="mt-4 text-sm text-slate-200 sm:text-base md:text-lg">
            Every contribution — large or small — helps us organise events,
            support youth programs, and preserve our cultural heritage.
            Together, one voice becomes one force for change.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-8">
            <a
              href="#give"
              className="rounded-full bg-amber-400 px-6 py-3 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/30 transition hover:bg-amber-300"
            >
              Give now
            </a>
            <a
              href="#other-ways"
              className="rounded-full border border-cyan-200/40 bg-white/5 px-6 py-3 text-center text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/10"
            >
              Other ways to help
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactGrid() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-20">
      <div className="mb-8 max-w-2xl md:mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Where your gift goes
        </p>
        <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
          Every Naira we receive powers community impact.
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3">
        {impactAreas.map((item) => (
          <article
            key={item.title}
            className="rounded-3xl border border-cyan-200/15 bg-slate-900/40 p-6 transition hover:-translate-y-1 hover:border-amber-300/40"
          >
            <p
              className={`text-xs font-semibold uppercase tracking-[0.2em] ${item.accent}`}
            >
              Impact Area
            </p>
            <h3 className="mt-3 text-xl font-semibold text-white">
              {item.title}
            </h3>
            <p className="mt-3 text-sm text-slate-300">{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AmountsAndBank() {
  const [selected, setSelected] = useState<string>("10,000");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (key: string, value: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(key);
        window.setTimeout(() => setCopied((prev) => (prev === key ? null : prev)), 1800);
      })
      .catch(() => {
        setCopied(null);
      });
  };

  return (
    <section
      id="give"
      className="border-t border-cyan-300/10 bg-slate-900/40"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-12 sm:gap-8 md:grid-cols-[1.1fr,1fr] md:px-6 md:py-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
            Choose an amount
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Pick a level that feels right for you.
          </h2>
          <p className="mt-3 max-w-xl text-sm text-slate-300 md:text-base">
            Select a suggested amount or give any custom figure. All
            donations are acknowledged with a thank-you email and quarterly
            impact updates.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {amounts.map((amount) => {
              const active = selected === amount.value;
              return (
                <button
                  key={amount.value}
                  type="button"
                  onClick={() => setSelected(amount.value)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    active
                      ? "border-amber-300 bg-amber-400/10"
                      : "border-cyan-200/15 bg-slate-950/40 hover:border-cyan-200/35"
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-widest text-slate-400">
                    {amount.label}
                  </p>
                  <p
                    className={`mt-1 text-lg font-bold ${
                      active ? "text-amber-300" : "text-white"
                    }`}
                  >
                    {amount.value === "Custom" ? "Any ₦" : `₦${amount.value}`}
                  </p>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-slate-400">
            You&apos;ve selected:{" "}
            <span className="font-semibold text-amber-300">
              {selected === "Custom"
                ? "Any amount you choose"
                : `₦${selected}`}
            </span>
          </p>
        </div>

        <aside className="glass-card rounded-3xl p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Bank transfer
          </p>
          <h3 className="mt-3 text-xl font-semibold text-white">
            Send to our official account
          </h3>
          <dl className="mt-5 space-y-3 text-sm">
            <BankRow
              label="Bank"
              value={bankDetails.bankName}
              copyKey="bank"
              copied={copied}
              onCopy={copy}
            />
            <BankRow
              label="Account Name"
              value={bankDetails.accountName}
              copyKey="name"
              copied={copied}
              onCopy={copy}
            />
            <BankRow
              label="Account Number"
              value={bankDetails.accountNumber}
              copyKey="number"
              copied={copied}
              onCopy={copy}
              mono
            />
            <BankRow
              label="Currency"
              value={bankDetails.currency}
              copyKey="currency"
              copied={copied}
              onCopy={copy}
            />
          </dl>
          <p className="mt-5 text-xs text-slate-400">
            After transferring, please email a confirmation to{" "}
            <a
              href="mailto:eyovaclub@gmail.com"
              className="text-cyan-200 hover:text-amber-300"
            >
              eyovaclub@gmail.com
            </a>{" "}
            so we can thank you and issue a receipt.
          </p>
        </aside>
      </div>
    </section>
  );
}

function BankRow({
  label,
  value,
  copyKey,
  copied,
  onCopy,
  mono = false,
}: {
  label: string;
  value: string;
  copyKey: string;
  copied: string | null;
  onCopy: (key: string, value: string) => void;
  mono?: boolean;
}) {
  const isCopied = copied === copyKey;
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-cyan-200/15 bg-slate-950/60 px-3 py-2">
      <div className="min-w-0">
        <dt className="text-[10px] uppercase tracking-widest text-slate-400">
          {label}
        </dt>
        <dd
          className={`truncate text-sm text-white ${
            mono ? "font-mono tracking-wider" : ""
          }`}
        >
          {value}
        </dd>
      </div>
      <button
        type="button"
        onClick={() => onCopy(copyKey, value)}
        className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
          isCopied
            ? "border-amber-300 bg-amber-400/15 text-amber-200"
            : "border-cyan-300/30 text-cyan-200 hover:border-amber-300/60 hover:text-amber-200"
        }`}
        aria-label={`Copy ${label}`}
      >
        {isCopied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

function OtherWays() {
  return (
    <section
      id="other-ways"
      className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-20"
    >
      <div className="mb-8 max-w-2xl md:mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
          Beyond money
        </p>
        <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
          Other ways to support the club.
        </h2>
        <p className="mt-3 text-sm text-slate-300 md:text-base">
          Not in a position to donate right now? You can still make a huge
          difference.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3">
        {otherWays.map((way) => (
          <article
            key={way.title}
            className="rounded-3xl border border-cyan-200/15 bg-slate-900/40 p-6 transition hover:-translate-y-1 hover:border-cyan-200/40"
          >
            <h3 className="text-lg font-semibold text-white">{way.title}</h3>
            <p className="mt-3 text-sm text-slate-300">{way.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-14 md:px-6 md:pb-20">
      <div className="relative overflow-hidden rounded-3xl border border-cyan-200/20 bg-gradient-to-br from-amber-900/30 via-slate-950 to-cyan-900/40 p-6 sm:p-8 md:p-14">
        <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute -bottom-16 left-10 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[2fr,1fr] md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Questions about donating?
            </h2>
            <p className="mt-3 text-sm text-slate-200 md:text-base">
              Whether you&apos;re giving once, giving monthly, or planning a
              corporate partnership, we&apos;d love to talk. Reach out and our
              team will get back to you.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap md:justify-end">
            <a
              href="mailto:eyovaclub@gmail.com?subject=Donation%20enquiry"
              className="rounded-full bg-amber-400 px-6 py-3 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/30 hover:bg-amber-300"
            >
              Email us
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100086977344332"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-cyan-200/40 bg-white/5 px-6 py-3 text-center text-sm font-semibold text-cyan-100 hover:bg-cyan-300/10"
            >
              Message on Facebook
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
