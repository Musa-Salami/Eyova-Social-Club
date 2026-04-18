"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatDate } from "@/lib/data";
import type { ClubEvent } from "@/lib/data";
import { useEvents, useMembers } from "@/hooks/use-content";
import { EventModal } from "@/components/event-modal";

export default function Home() {
  const { events } = useEvents();
  const { members } = useMembers();
  const upcomingEvents = events
    .filter((event) => event.status === "UPCOMING")
    .slice(0, 3);
  const featuredMembers = members.slice(0, 3);
  const stats = {
    totalMembers: members.length,
    totalEvents: events.length,
    upcomingCount: events.filter((event) => event.status === "UPCOMING")
      .length,
    passedCount: events.filter((event) => event.status === "PASSED").length,
  };
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);

  return (
    <div className="flex flex-col">
      <Hero stats={stats} />
      <Mission />
      <ImpactStats stats={stats} />
      <EventsShowcase
        events={upcomingEvents}
        onSelect={setSelectedEvent}
      />
      <TeamPreview members={featuredMembers} />
      <CallToAction />
      {selectedEvent ? (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      ) : null}
    </div>
  );
}

function Hero({
  stats,
}: {
  stats: {
    totalMembers: number;
    totalEvents: number;
    upcomingCount: number;
  };
}) {
  const yearsActive = Math.max(
    1,
    new Date().getFullYear() - 2022,
  );
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=1920&q=80"
          alt="Community gathering"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/80 to-cyan-950/80" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/eyova-logo.jpg"
                alt="Eyova logo"
                width={56}
                height={56}
                className="rounded-xl border border-cyan-300/30"
              />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
                Ebira Youths • One Voice • Abuja
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-5xl">
              One Community.
              <span className="block bg-gradient-to-r from-amber-300 via-cyan-200 to-amber-300 bg-clip-text text-transparent">
                One Voice. One Future.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base text-slate-200 md:text-lg">
              Eyova Social Club empowers youths through unity, culture, social
              impact, and collaboration. Join us as we build a stronger, more
              inclusive Ebira community in Abuja and beyond.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/what-we-do"
                className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/30 transition hover:bg-amber-300"
              >
                Explore Our Events
              </Link>
              <Link
                href="/members"
                className="rounded-full border border-cyan-200/40 bg-white/5 px-6 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/10"
              >
                Meet Our Members
              </Link>
            </div>

            <div className="mt-8 grid max-w-md grid-cols-3 gap-3 text-center">
              <HeroBadge
                label="Members"
                value={`${stats.totalMembers}+`}
              />
              <HeroBadge
                label="Events"
                value={`${stats.totalEvents}+`}
              />
              <HeroBadge label="Years" value={`${yearsActive}+`} />
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute -inset-6 -z-10 rounded-[32px] bg-gradient-to-br from-cyan-400/20 via-amber-300/10 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-cyan-200/20 shadow-2xl shadow-cyan-900/30">
              <Image
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80"
                alt="Youth community"
                width={1000}
                height={1200}
                className="h-[480px] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-cyan-200/20 bg-slate-950/80 px-4 py-3 backdrop-blur">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <p className="text-xs text-slate-200">
                Active in 5+ community initiatives this year
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-cyan-200/20 bg-white/5 p-3 backdrop-blur">
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-cyan-200">
        {label}
      </p>
    </div>
  );
}

function Mission() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-cyan-200/15">
            <Image
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=80"
              alt="Community initiatives"
              width={900}
              height={700}
              className="h-[380px] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden rounded-2xl border border-amber-300/30 bg-slate-950/90 p-4 md:block">
            <p className="text-xs uppercase tracking-widest text-amber-300">
              Our Promise
            </p>
            <p className="mt-1 text-sm text-slate-100">
              Empower youths. Preserve heritage. Drive impact.
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            About Us
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Building a united Ebira youth voice in Abuja.
          </h2>
          <p className="mt-4 text-slate-300">
            We bring together young people passionate about cultural identity,
            social impact, and collective growth. Through community events,
            mentorship, and advocacy, we create opportunities for members to
            thrive, connect, and serve.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Pillar title="Unity" description="One people, one voice." />
            <Pillar title="Impact" description="Programs that uplift lives." />
            <Pillar title="Culture" description="Honoring our heritage." />
            <Pillar title="Growth" description="Mentorship & leadership." />
          </div>
        </div>
      </div>
    </section>
  );
}

function Pillar({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-cyan-200/15 bg-white/5 p-4 transition hover:border-cyan-200/40">
      <p className="text-sm font-semibold text-amber-300">{title}</p>
      <p className="mt-1 text-sm text-slate-300">{description}</p>
    </div>
  );
}

function ImpactStats({
  stats,
}: {
  stats: {
    totalMembers: number;
    totalEvents: number;
    upcomingCount: number;
    passedCount: number;
  };
}) {
  return (
    <section className="border-y border-cyan-300/10 bg-slate-900/40">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-14 md:grid-cols-4 md:px-6">
        <Stat label="Members" value={stats.totalMembers} accent="cyan" />
        <Stat label="Events" value={stats.totalEvents} accent="amber" />
        <Stat label="Upcoming" value={stats.upcomingCount} accent="cyan" />
        <Stat label="Passed" value={stats.passedCount} accent="amber" />
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "cyan" | "amber";
}) {
  const accentColor =
    accent === "cyan" ? "text-cyan-200" : "text-amber-300";
  return (
    <div className="text-center">
      <p className={`text-5xl font-bold ${accentColor}`}>{value}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400">
        {label}
      </p>
    </div>
  );
}

function EventsShowcase({
  events,
  onSelect,
}: {
  events: ClubEvent[];
  onSelect: (event: ClubEvent) => void;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            What&apos;s next
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Upcoming Events
          </h2>
        </div>
        <Link
          href="/what-we-do"
          className="rounded-full border border-amber-300/40 px-5 py-2 text-sm text-amber-200 hover:bg-amber-300/10"
        >
          View all events →
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-cyan-200/20 bg-slate-900/40 p-10 text-center text-sm text-slate-300">
          No upcoming events at the moment. Check back soon or visit
          {" "}
          <Link
            href="/what-we-do"
            className="text-amber-300 hover:text-amber-200"
          >
            What we do
          </Link>{" "}
          to see past events.
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {events.map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => onSelect(event)}
              className="group flex flex-col overflow-hidden rounded-3xl border border-cyan-200/15 bg-slate-900/40 text-left transition hover:-translate-y-1 hover:border-amber-300/40 focus:outline-none focus:ring-2 focus:ring-amber-300/60"
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
                <span className="absolute left-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-slate-950">
                  Upcoming
                </span>
              </div>
              <div className="flex flex-1 flex-col space-y-3 p-5">
                <h3 className="text-lg font-semibold text-white">
                  {event.title}
                </h3>
                <p className="line-clamp-2 text-sm text-slate-300">
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
      )}
    </section>
  );
}

function TeamPreview({
  members,
}: {
  members: {
    id: string;
    fullName: string;
    role: string;
    passport: string;
    bio: string;
  }[];
}) {
  return (
    <section className="border-t border-cyan-300/10 bg-slate-900/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
              Our people
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
              Meet the Leadership
            </h2>
          </div>
          <Link
            href="/members"
            className="rounded-full border border-cyan-200/40 px-5 py-2 text-sm text-cyan-200 hover:bg-cyan-300/10"
          >
            View members →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {members.map((member) => (
            <article
              key={member.id}
              className="group rounded-3xl border border-cyan-200/15 bg-slate-950/60 p-5 transition hover:-translate-y-1 hover:border-cyan-200/40"
            >
              <div className="mx-auto h-28 w-28 overflow-hidden rounded-2xl border border-cyan-200/20">
                <Image
                  src={member.passport}
                  alt={member.fullName}
                  width={160}
                  height={160}
                  unoptimized
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 text-center text-lg font-semibold text-white">
                {member.fullName}
              </h3>
              <p className="text-center text-sm text-amber-300">
                {member.role}
              </p>
              <p className="mt-3 line-clamp-2 text-center text-sm text-slate-300">
                {member.bio}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-cyan-200/20 bg-gradient-to-br from-cyan-900/60 via-slate-950 to-amber-900/30 p-8 md:p-14">
        <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute -bottom-16 left-10 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[2fr,1fr] md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Ready to make an impact with us?
            </h2>
            <p className="mt-3 text-slate-200">
              Be part of a movement building unity, cultural pride, and real
              community impact. Join our upcoming events or connect with our
              leadership team today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              href="/what-we-do"
              className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/30 hover:bg-amber-300"
            >
              Join an event
            </Link>
            <Link
              href="/donate"
              className="rounded-full border border-cyan-200/40 bg-white/5 px-6 py-3 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/10"
            >
              Donate
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

