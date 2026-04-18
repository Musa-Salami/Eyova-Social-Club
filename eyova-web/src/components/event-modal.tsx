"use client";

import Image from "next/image";
import { useEffect } from "react";
import { formatDate } from "@/lib/data";
import type { ClubEvent } from "@/lib/data";

export function EventModal({
  event,
  onClose,
}: {
  event: ClubEvent;
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

  const isUpcoming = event.status === "UPCOMING";
  const badgeClass = isUpcoming
    ? "bg-amber-400 text-slate-950"
    : "bg-cyan-500 text-slate-950";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-cyan-200/20 bg-slate-900 shadow-2xl"
      >
        <div className="relative h-56 w-full overflow-hidden md:h-64">
          <Image
            src={event.banner}
            alt={event.title}
            fill
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          <span
            className={`absolute left-5 top-5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${badgeClass}`}
          >
            {event.status}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-slate-950/70 text-white transition hover:border-amber-300 hover:text-amber-300"
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

        <div className="space-y-5 p-6 md:p-8">
          <div>
            <h2
              id="event-modal-title"
              className="text-2xl font-bold text-white md:text-3xl"
            >
              {event.title}
            </h2>
            <p className="mt-2 text-sm text-slate-300">{event.description}</p>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <InfoTile label="Date" value={formatDate(event.date)} />
            {event.time ? (
              <InfoTile label="Time" value={event.time} />
            ) : null}
            <InfoTile label="Location" value={event.location} />
            {event.host ? (
              <InfoTile label="Host" value={event.host} />
            ) : null}
          </dl>

          {event.details ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                About this event
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-200">
                {event.details}
              </p>
            </div>
          ) : null}

          {event.contact ? (
            <div className="rounded-2xl border border-cyan-200/15 bg-slate-950/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                Contact / RSVP
              </p>
              <p className="mt-2 text-sm text-slate-200">{event.contact}</p>
            </div>
          ) : null}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-cyan-200/30 px-5 py-2 text-sm text-cyan-100 hover:bg-cyan-300/10"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-cyan-200/15 bg-slate-950/40 p-3">
      <p className="text-[10px] uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm text-slate-100">{value}</p>
    </div>
  );
}
