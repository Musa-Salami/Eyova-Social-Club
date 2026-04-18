"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatDate } from "@/lib/data";
import type { ClubEvent } from "@/lib/data";
import { useEvents } from "@/hooks/use-content";
import { EventModal } from "@/components/event-modal";

const programs = [
  {
    title: "Community Outreach",
    description:
      "Volunteer-led outreach to schools and communities, focused on mentorship, civic awareness, and practical digital skills.",
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=80",
  },
  {
    title: "Leadership & Mentorship",
    description:
      "Leadership development, mentorship circles, and career guidance to empower emerging voices in our community.",
    image:
      "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=1200&q=80",
  },
  {
    title: "Culture & Heritage",
    description:
      "Cultural events, storytelling, and heritage showcases that celebrate and preserve our shared identity.",
    image:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&q=80",
  },
  {
    title: "Strategic Networking",
    description:
      "Structured mixers and workshops where members collaborate, share ideas, and grow together.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80",
  },
];

export default function WhatWeDoPage() {
  const { events } = useEvents();
  const upcoming = events.filter((event) => event.status === "UPCOMING");
  const passed = events.filter((event) => event.status === "PASSED");
  const [selected, setSelected] = useState<ClubEvent | null>(null);

  return (
    <div className="flex flex-col">
      <HeroHeader />
      <ProgramsSection />
      <EventsSection
        title="Upcoming Events"
        subtitle="Join us at our next community gatherings."
        accent="amber"
        eventsList={upcoming}
        onSelect={setSelected}
      />
      <EventsSection
        title="Past Events"
        subtitle="Highlights from events we have organized."
        accent="cyan"
        eventsList={passed}
        onSelect={setSelected}
      />
      <CTA />
      {selected ? (
        <EventModal event={selected} onClose={() => setSelected(null)} />
      ) : null}
    </div>
  );
}

function HeroHeader() {
  return (
    <section className="relative isolate overflow-hidden border-b border-cyan-300/10">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80"
          alt="What we do hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/80 to-cyan-950/80" />
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
          What We Do
        </p>
        <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
          Programs, Events & Community Impact
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-200 md:text-lg">
          From community outreach to cultural celebration and strategic
          networking — here is how Eyova Social Club empowers youths and
          strengthens bonds that last a lifetime.
        </p>
      </div>
    </section>
  );
}

function ProgramsSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Our Programs
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
          Pillars of our community work
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {programs.map((program) => (
          <article
            key={program.title}
            className="group overflow-hidden rounded-3xl border border-cyan-200/15 bg-slate-900/40 transition hover:-translate-y-1 hover:border-amber-300/40"
          >
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src={program.image}
                alt={program.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-white">
                {program.title}
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                {program.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EventsSection({
  title,
  subtitle,
  accent,
  eventsList,
  onSelect,
}: {
  title: string;
  subtitle: string;
  accent: "amber" | "cyan";
  eventsList: ClubEvent[];
  onSelect: (event: ClubEvent) => void;
}) {
  if (eventsList.length === 0) return null;
  const accentColor =
    accent === "amber" ? "text-amber-300" : "text-cyan-300";
  const badgeColor =
    accent === "amber"
      ? "bg-amber-400 text-slate-950"
      : "bg-cyan-500 text-slate-950";

  return (
    <section className="border-t border-cyan-300/10 bg-slate-900/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="mb-8">
          <p
            className={`text-xs font-semibold uppercase tracking-[0.3em] ${accentColor}`}
          >
            {title}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            {subtitle}
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {eventsList.map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => onSelect(event)}
              className="group flex flex-col overflow-hidden rounded-3xl border border-cyan-200/15 bg-slate-950/50 text-left transition hover:-translate-y-1 hover:border-amber-300/40 focus:outline-none focus:ring-2 focus:ring-amber-300/60"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={event.banner}
                  alt={event.title}
                  fill
                  unoptimized
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${badgeColor}`}
                >
                  {event.status}
                </span>
              </div>
              <div className="flex flex-1 flex-col space-y-3 p-5">
                <h3 className="text-lg font-semibold text-white">
                  {event.title}
                </h3>
                <p className="line-clamp-3 text-sm text-slate-300">
                  {event.description}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                  <span className="rounded-full border border-cyan-200/20 px-3 py-1">
                    {formatDate(event.date)}
                  </span>
                  <span className="rounded-full border border-cyan-200/20 px-3 py-1">
                    {event.location}
                  </span>
                </div>
                <span className="mt-auto inline-flex items-center gap-1 pt-1 text-xs font-semibold text-amber-300 transition group-hover:text-amber-200">
                  View details →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-cyan-200/20 bg-gradient-to-br from-cyan-900/60 via-slate-950 to-amber-900/30 p-8 md:p-14">
        <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute -bottom-16 left-10 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[2fr,1fr] md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Want to be part of what we do?
            </h2>
            <p className="mt-3 text-slate-200">
              Follow our upcoming events or reach out to our leadership to
              discuss partnerships, volunteering, or membership.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              href="/members"
              className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/30 hover:bg-amber-300"
            >
              Meet our members
            </Link>
            <Link
              href="/"
              className="rounded-full border border-cyan-200/40 bg-white/5 px-6 py-3 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/10"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
