"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { formatDate } from "@/lib/data";
import type { Member } from "@/lib/data";
import { useMembers } from "@/hooks/use-content";

export default function MembersPage() {
  const { members } = useMembers();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selected, setSelected] = useState<Member | null>(null);

  const roles = useMemo(() => {
    const unique = Array.from(new Set(members.map((m) => m.role)));
    return ["All", ...unique];
  }, [members]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((member) => {
      const matchesRole = roleFilter === "All" || member.role === roleFilter;
      const matchesQuery =
        !q ||
        member.fullName.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        member.bio.toLowerCase().includes(q);
      return matchesRole && matchesQuery;
    });
  }, [query, roleFilter, members]);

  return (
    <section className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 md:px-6 md:py-14">
      <header className="relative overflow-hidden rounded-3xl border border-cyan-200/15 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/60 p-8 md:p-12">
        <div className="absolute -right-14 -top-14 h-60 w-60 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute -bottom-20 left-10 h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
            Our People
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
            Members Directory
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
            Passport photos, biodata, and roles of our active community
            members.
          </p>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-cyan-200/15 bg-slate-900/40 p-3 backdrop-blur">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, role or bio..."
          className="flex-1 min-w-[200px] rounded-xl border border-cyan-300/20 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
        />
        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          className="rounded-xl border border-cyan-300/20 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <p className="ml-auto text-xs text-slate-400">
          {filtered.length} of {members.length} members
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((member) => (
          <article
            key={member.id}
            className="group flex flex-col rounded-3xl border border-cyan-200/15 bg-slate-900/40 p-7 transition hover:-translate-y-1 hover:border-amber-300/40 hover:shadow-xl hover:shadow-amber-500/5"
          >
            <div className="mx-auto aspect-square w-44 overflow-hidden rounded-2xl border border-cyan-200/25 shadow-lg shadow-slate-950/40 md:w-48">
              <Image
                src={member.passport}
                alt={`${member.fullName} passport`}
                width={240}
                height={240}
                unoptimized
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="mt-5 space-y-1.5 text-center">
              <h2 className="text-2xl font-semibold text-white">
                {member.fullName}
              </h2>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                {member.role}
              </p>
            </div>
            <p className="mt-4 line-clamp-4 text-center text-base leading-relaxed text-slate-300">
              {member.bio}
            </p>
            <button
              type="button"
              onClick={() => setSelected(member)}
              className="mt-6 w-full rounded-xl border border-cyan-300/30 bg-white/5 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/10"
            >
              View details
            </button>
          </article>
        ))}
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-cyan-200/20 p-8 text-center text-sm text-slate-400">
            No members matched your search.
          </div>
        ) : null}
      </div>

      {selected ? (
        <MemberModal member={selected} onClose={() => setSelected(null)} />
      ) : null}
    </section>
  );
}

function MemberModal({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-cyan-200/20 bg-slate-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-28 w-full overflow-hidden bg-gradient-to-br from-cyan-900 via-slate-900 to-amber-900/40 md:h-32">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="absolute -bottom-12 left-10 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/70 text-white transition hover:border-amber-300 hover:text-amber-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="relative z-10 px-6 pb-8 md:px-10">
          <div className="-mt-20 flex flex-col items-center gap-5 md:-mt-24 md:flex-row md:items-end md:gap-7">
            <div className="h-40 w-40 flex-none overflow-hidden rounded-2xl border-4 border-slate-900 bg-slate-900 shadow-xl shadow-slate-950/50 md:h-48 md:w-48">
              <Image
                src={member.passport}
                alt={member.fullName}
                width={256}
                height={256}
                unoptimized
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3
                id="member-modal-title"
                className="text-3xl font-bold text-white md:text-4xl"
              >
                {member.fullName}
              </h3>
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
                {member.role}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Joined {formatDate(member.joinedDate)}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Biography
            </p>
            <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-slate-200">
              {member.bio}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <InfoRow label="Email" value={member.email} />
            <InfoRow label="Joined" value={formatDate(member.joinedDate)} />
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-cyan-200/30 px-6 py-2.5 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/10"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-cyan-200/15 bg-slate-950/40 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-2 break-words text-base text-slate-100">{value}</p>
    </div>
  );
}
