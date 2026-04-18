"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { ADMIN_SESSION_KEY } from "@/lib/admin-auth";
import type { ClubEvent, Member } from "@/lib/data";
import { formatDate } from "@/lib/data";
import {
  createEvent,
  createMember,
  deleteEvent as removeEvent,
  deleteMember as removeMember,
  updateEvent as patchEvent,
  updateMember as patchMember,
} from "@/lib/content-store";
import { useEvents, useMembers } from "@/hooks/use-content";
import { compressImage } from "@/lib/image";
import { ImageCropper } from "@/components/image-cropper";

type Section = "overview" | "events" | "members";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // pre-compression guard: 10 MB
const SAVE_TIMEOUT_MS = 15_000; // fail fast if Firestore is unreachable

function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new Error(
          `${label} timed out after ${SAVE_TIMEOUT_MS / 1000}s. Check your internet connection, or confirm Cloud Firestore is enabled for this project.`,
        ),
      );
    }, SAVE_TIMEOUT_MS);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

const emptyEventForm = {
  title: "",
  description: "",
  location: "",
  date: "",
  status: "UPCOMING" as ClubEvent["status"],
  banner: "",
  time: "",
  host: "",
  contact: "",
  details: "",
};

const emptyMemberForm = {
  fullName: "",
  role: "",
  passport: "",
  bio: "",
  email: "",
  joinedDate: "",
};

function toDateInputValue(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function AdminPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [section, setSection] = useState<Section>("overview");

  const { events, loading: loadingEvents } = useEvents();
  const { members, loading: loadingMembers } = useMembers();

  const [eventForm, setEventForm] = useState(emptyEventForm);
  const [eventBannerFile, setEventBannerFile] = useState<File | null>(null);
  const [eventBannerPreview, setEventBannerPreview] = useState("");
  const [eventCroppedData, setEventCroppedData] = useState("");
  const [eventCropperSrc, setEventCropperSrc] = useState("");
  const [eventMessage, setEventMessage] = useState("");
  const [eventMessageKind, setEventMessageKind] = useState<"info" | "error">(
    "info",
  );
  const [savingEvent, setSavingEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const [memberForm, setMemberForm] = useState(emptyMemberForm);
  const [memberPassportFile, setMemberPassportFile] = useState<File | null>(
    null,
  );
  const [memberPassportPreview, setMemberPassportPreview] = useState("");
  const [memberCroppedData, setMemberCroppedData] = useState("");
  const [memberCropperSrc, setMemberCropperSrc] = useState("");
  const [memberMessage, setMemberMessage] = useState("");
  const [memberMessageKind, setMemberMessageKind] = useState<
    "info" | "error"
  >("info");
  const [savingMember, setSavingMember] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  useEffect(() => {
    const isAuth = localStorage.getItem(ADMIN_SESSION_KEY) === "true";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthorized(isAuth);
    setMounted(true);
  }, []);

  const dashboard = useMemo(
    () => ({
      totalEvents: events.length,
      totalMembers: members.length,
      upcomingEvents: events.filter((e) => e.status === "UPCOMING").length,
      passedEvents: events.filter((e) => e.status === "PASSED").length,
    }),
    [events, members.length],
  );

  const saveEvent = async () => {
    if (!eventForm.title || !eventForm.date || !eventForm.location) {
      setEventMessageKind("error");
      setEventMessage("Please fill title, location and date.");
      return;
    }
    setSavingEvent(true);
    setEventMessageKind("info");
    setEventMessage(editingEventId ? "Saving changes..." : "Publishing...");
    try {
      let bannerData = eventCroppedData || eventForm.banner;
      if (!eventCroppedData && eventBannerFile) {
        bannerData = await compressImage(eventBannerFile, {
          maxDim: 1200,
          quality: 0.78,
        });
      }
      const payload = {
        title: eventForm.title,
        description:
          eventForm.description || "No description provided yet.",
        location: eventForm.location,
        date: new Date(eventForm.date).toISOString(),
        status: eventForm.status,
        banner:
          bannerData ||
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1280&q=80",
        time: eventForm.time || "",
        host: eventForm.host || "",
        contact: eventForm.contact || "",
        details: eventForm.details || "",
      };
      if (editingEventId) {
        await withTimeout(patchEvent(editingEventId, payload), "Updating event");
        setEventMessageKind("info");
        setEventMessage("Event updated successfully.");
      } else {
        await withTimeout(createEvent(payload), "Publishing event");
        setEventMessageKind("info");
        setEventMessage("Event published and visible on the site.");
      }
      setEventForm(emptyEventForm);
      setEventBannerFile(null);
      setEventBannerPreview("");
      setEventCroppedData("");
      setEditingEventId(null);
    } catch (err) {
      setEventMessageKind("error");
      setEventMessage(
        err instanceof Error ? err.message : "Failed to save event.",
      );
    } finally {
      setSavingEvent(false);
    }
  };

  const startEditEvent = (event: ClubEvent) => {
    setEditingEventId(event.id);
    setEventForm({
      title: event.title ?? "",
      description: event.description ?? "",
      location: event.location ?? "",
      date: toDateInputValue(event.date),
      status: event.status,
      banner: event.banner ?? "",
      time: event.time ?? "",
      host: event.host ?? "",
      contact: event.contact ?? "",
      details: event.details ?? "",
    });
    setEventBannerFile(null);
    setEventBannerPreview(event.banner ?? "");
    setEventCroppedData("");
    setEventMessage(`Editing "${event.title}" — make your changes and save.`);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const cancelEditEvent = () => {
    setEditingEventId(null);
    setEventForm(emptyEventForm);
    setEventBannerFile(null);
    setEventBannerPreview("");
    setEventCroppedData("");
    setEventMessage("");
  };

  const deleteEvent = async (id: string) => {
    try {
      await removeEvent(id);
      if (editingEventId === id) cancelEditEvent();
    } catch (err) {
      console.error(err);
    }
  };

  const saveMember = async () => {
    if (
      !memberForm.fullName ||
      !memberForm.role ||
      !memberForm.joinedDate
    ) {
      setMemberMessageKind("error");
      setMemberMessage("Please fill name, role and joined date.");
      return;
    }
    setSavingMember(true);
    setMemberMessageKind("info");
    setMemberMessage(editingMemberId ? "Saving changes..." : "Publishing...");
    try {
      let passportData = memberCroppedData || memberForm.passport;
      if (!memberCroppedData && memberPassportFile) {
        passportData = await compressImage(memberPassportFile, {
          maxDim: 600,
          quality: 0.82,
        });
      }
      if (!passportData) {
        setMemberMessageKind("error");
        setMemberMessage(
          "Please upload a passport photo or enter a Passport URL before publishing.",
        );
        setSavingMember(false);
        return;
      }
      const payload = {
        fullName: memberForm.fullName,
        role: memberForm.role,
        passport: passportData,
        bio: memberForm.bio || "Biodata will be updated by admin.",
        email: memberForm.email || "not-provided@eyova.club",
        joinedDate: memberForm.joinedDate,
      };
      if (editingMemberId) {
        await withTimeout(
          patchMember(editingMemberId, payload),
          "Updating member",
        );
        setMemberMessageKind("info");
        setMemberMessage("Member updated successfully.");
      } else {
        await withTimeout(createMember(payload), "Publishing member");
        setMemberMessageKind("info");
        setMemberMessage("Member published and visible on the site.");
      }
      setMemberForm(emptyMemberForm);
      setMemberPassportFile(null);
      setMemberPassportPreview("");
      setMemberCroppedData("");
      setEditingMemberId(null);
    } catch (err) {
      setMemberMessageKind("error");
      setMemberMessage(
        err instanceof Error ? err.message : "Failed to save member.",
      );
    } finally {
      setSavingMember(false);
    }
  };

  const startEditMember = (member: Member) => {
    setEditingMemberId(member.id);
    setMemberForm({
      fullName: member.fullName ?? "",
      role: member.role ?? "",
      passport: member.passport ?? "",
      bio: member.bio ?? "",
      email: member.email ?? "",
      joinedDate: toDateInputValue(member.joinedDate),
    });
    setMemberPassportFile(null);
    setMemberPassportPreview(member.passport ?? "");
    setMemberCroppedData("");
    setMemberMessage(
      `Editing "${member.fullName}" — make your changes and save.`,
    );
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const cancelEditMember = () => {
    setEditingMemberId(null);
    setMemberForm(emptyMemberForm);
    setMemberPassportFile(null);
    setMemberPassportPreview("");
    setMemberCroppedData("");
    setMemberMessage("");
  };

  const deleteMember = async (id: string) => {
    try {
      await removeMember(id);
      if (editingMemberId === id) cancelEditMember();
    } catch (err) {
      console.error(err);
    }
  };

  const onPassportUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      setMemberMessage("Image too large. Please choose a file under 10 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) {
        setMemberMessage("Could not read the selected image.");
        return;
      }
      setMemberPassportFile(file);
      setMemberForm((prev) => ({ ...prev, passport: "" }));
      setMemberCropperSrc(result);
      setMemberMessage("Adjust the crop to fit the square display.");
    };
    reader.onerror = () => setMemberMessage("Failed to read file.");
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const onBannerUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      setEventMessage("Image too large. Please choose a file under 10 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) {
        setEventMessage("Could not read the selected image.");
        return;
      }
      setEventBannerFile(file);
      setEventForm((prev) => ({ ...prev, banner: "" }));
      setEventCropperSrc(result);
      setEventMessage("Adjust the crop to fit the event banner.");
    };
    reader.onerror = () => setEventMessage("Failed to read file.");
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    router.push("/admin/login");
  };

  if (!mounted) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-14 md:px-6">
        <div className="glass-card rounded-3xl p-6 text-sm text-slate-200">
          Loading admin console...
        </div>
      </section>
    );
  }

  if (!authorized) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-14 md:px-6">
        <div className="glass-card rounded-3xl p-6 text-sm text-slate-200">
          <p>Admin session not found. Please login to continue.</p>
          <Link
            href="/admin/login"
            className="mt-4 inline-flex rounded-lg bg-amber-400 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-300"
          >
            Go to Admin Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 md:px-6 md:py-14">
      <header className="relative overflow-hidden rounded-3xl border border-cyan-200/15 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/60 p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
              Admin Console
            </p>
            <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">
              Manage Eyova Social Club
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Publish events and members. Changes are saved to the cloud and
              appear instantly for every visitor.
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-cyan-300/30 px-4 py-1.5 text-xs font-semibold text-cyan-200 hover:bg-cyan-300/10"
          >
            Sign out
          </button>
        </div>

        <div className="mt-6 inline-flex flex-wrap rounded-full border border-cyan-200/15 bg-slate-950/60 p-1 text-xs">
          {(
            [
              { id: "overview", label: "Overview" },
              { id: "events", label: "Events" },
              { id: "members", label: "Members" },
            ] as { id: Section; label: string }[]
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`rounded-full px-4 py-1.5 font-semibold transition ${
                section === item.id
                  ? "bg-amber-400 text-slate-950"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {section === "overview" ? (
        <div className="grid gap-4 md:grid-cols-4">
          <Metric title="Total Events" value={String(dashboard.totalEvents)} />
          <Metric
            title="Upcoming Events"
            value={String(dashboard.upcomingEvents)}
          />
          <Metric
            title="Passed Events"
            value={String(dashboard.passedEvents)}
          />
          <Metric
            title="Total Members"
            value={String(dashboard.totalMembers)}
          />
          <section className="glass-card rounded-2xl p-5 md:col-span-2">
            <h3 className="text-lg font-semibold text-white">
              Recent Events
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {loadingEvents ? (
                <li className="text-xs text-slate-400">Loading...</li>
              ) : null}
              {events.slice(0, 5).map((event) => (
                <li
                  key={event.id}
                  className="flex items-center justify-between rounded-lg border border-white/10 p-2"
                >
                  <span>
                    {event.title}
                    <span className="ml-2 text-xs text-slate-400">
                      {formatDate(event.date)}
                    </span>
                  </span>
                  <span className="rounded-full border border-cyan-200/20 px-2 py-0.5 text-[10px] uppercase tracking-widest text-cyan-200">
                    {event.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <section className="glass-card rounded-2xl p-5 md:col-span-2">
            <h3 className="text-lg font-semibold text-white">
              Recent Members
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {loadingMembers ? (
                <li className="text-xs text-slate-400">Loading...</li>
              ) : null}
              {members.slice(0, 5).map((member) => (
                <li
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-white/10 p-2"
                >
                  <span>{member.fullName}</span>
                  <span className="text-xs text-amber-300">{member.role}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}

      {section === "events" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="glass-card rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-cyan-200">
                  {editingEventId ? "Edit Event" : "Create Event"}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {editingEventId
                    ? "Update details. Changes appear instantly on the site."
                    : "Published events appear on the Home and What We Do pages."}
                </p>
              </div>
              {editingEventId ? (
                <span className="rounded-full border border-amber-300/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-amber-200">
                  Editing
                </span>
              ) : null}
            </div>
            <div className="mt-4 space-y-3">
              <Input
                label="Event Title"
                value={eventForm.title}
                onChange={(value) =>
                  setEventForm((prev) => ({ ...prev, title: value }))
                }
              />
              <TextArea
                label="Short Description"
                value={eventForm.description}
                onChange={(value) =>
                  setEventForm((prev) => ({ ...prev, description: value }))
                }
              />
              <TextArea
                label="Full Details (shown when visitors open the event)"
                value={eventForm.details}
                onChange={(value) =>
                  setEventForm((prev) => ({ ...prev, details: value }))
                }
              />
              <Input
                label="Location"
                value={eventForm.location}
                onChange={(value) =>
                  setEventForm((prev) => ({ ...prev, location: value }))
                }
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Date"
                  type="date"
                  value={eventForm.date}
                  onChange={(value) =>
                    setEventForm((prev) => ({ ...prev, date: value }))
                  }
                />
                <Input
                  label="Time (e.g. 4:00 PM)"
                  value={eventForm.time}
                  onChange={(value) =>
                    setEventForm((prev) => ({ ...prev, time: value }))
                  }
                />
              </div>
              <Input
                label="Host / Organizer"
                value={eventForm.host}
                onChange={(value) =>
                  setEventForm((prev) => ({ ...prev, host: value }))
                }
              />
              <Input
                label="Contact / RSVP"
                value={eventForm.contact}
                onChange={(value) =>
                  setEventForm((prev) => ({ ...prev, contact: value }))
                }
              />
              <FileInput
                label="Upload Banner"
                onChange={onBannerUpload}
                preview={eventBannerPreview}
                onRecrop={
                  eventBannerPreview
                    ? () => setEventCropperSrc(eventBannerPreview)
                    : undefined
                }
              />
              <Input
                label="Banner URL (optional)"
                value={eventForm.banner}
                onChange={(value) =>
                  setEventForm((prev) => ({ ...prev, banner: value }))
                }
              />
              <label className="block text-xs text-slate-300">
                Status
                <select
                  value={eventForm.status}
                  onChange={(event) =>
                    setEventForm((prev) => ({
                      ...prev,
                      status: event.target.value as ClubEvent["status"],
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-cyan-300/25 bg-slate-900 p-2 text-sm text-white outline-none focus:border-cyan-300"
                >
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="PASSED">PASSED</option>
                </select>
              </label>
              {eventMessage ? (
                <p
                  className={`rounded-lg border px-3 py-2 text-xs ${
                    eventMessageKind === "error"
                      ? "border-rose-400/40 bg-rose-500/10 text-rose-200"
                      : "border-cyan-200/20 bg-cyan-400/5 text-cyan-200"
                  }`}
                >
                  {eventMessage}
                </p>
              ) : null}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveEvent}
                  disabled={savingEvent}
                  className="flex-1 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:opacity-60"
                >
                  {savingEvent
                    ? editingEventId
                      ? "Saving..."
                      : "Publishing..."
                    : editingEventId
                      ? "Update Event"
                      : "Publish Event"}
                </button>
                {editingEventId ? (
                  <button
                    type="button"
                    onClick={cancelEditEvent}
                    disabled={savingEvent}
                    className="rounded-lg border border-cyan-200/30 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-300/10 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-5">
            <h2 className="text-xl font-semibold text-cyan-200">
              Published Events
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Click Edit to update any event's details.
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              {events.map((event) => (
                <li
                  key={event.id}
                  className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 ${
                    editingEventId === event.id
                      ? "border-amber-300/50 bg-amber-400/5"
                      : "border-cyan-200/15"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      {event.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(event.date)} • {event.location}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEditEvent(event)}
                      className="rounded-lg border border-amber-300/40 px-3 py-1 text-xs text-amber-200 hover:bg-amber-300/10"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteEvent(event.id)}
                      className="rounded-lg border border-rose-400/40 px-3 py-1 text-xs text-rose-200 hover:bg-rose-400/10"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
              {events.length === 0 ? (
                <li className="rounded-xl border border-dashed border-cyan-200/20 p-6 text-center text-xs text-slate-400">
                  No events yet.
                </li>
              ) : null}
            </ul>
          </section>
        </div>
      ) : null}

      {section === "members" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="glass-card rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-cyan-200">
                  {editingMemberId ? "Edit Member" : "Add Member"}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {editingMemberId
                    ? "Update passport, biography, or role."
                    : "Uploaded passport and biography will display on the Members directory."}
                </p>
              </div>
              {editingMemberId ? (
                <span className="rounded-full border border-amber-300/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-amber-200">
                  Editing
                </span>
              ) : null}
            </div>
            <div className="mt-4 space-y-3">
              <Input
                label="Full Name"
                value={memberForm.fullName}
                onChange={(value) =>
                  setMemberForm((prev) => ({ ...prev, fullName: value }))
                }
              />
              <Input
                label="Role"
                value={memberForm.role}
                onChange={(value) =>
                  setMemberForm((prev) => ({ ...prev, role: value }))
                }
              />
              <FileInput
                label="Upload Passport"
                onChange={onPassportUpload}
                preview={memberPassportPreview}
                square
                onRecrop={
                  memberPassportPreview
                    ? () => setMemberCropperSrc(memberPassportPreview)
                    : undefined
                }
              />
              <Input
                label="Passport URL (optional)"
                value={memberForm.passport}
                onChange={(value) =>
                  setMemberForm((prev) => ({ ...prev, passport: value }))
                }
              />
              <TextArea
                label="Little Biography"
                value={memberForm.bio}
                onChange={(value) =>
                  setMemberForm((prev) => ({ ...prev, bio: value }))
                }
              />
              <Input
                label="Email"
                value={memberForm.email}
                onChange={(value) =>
                  setMemberForm((prev) => ({ ...prev, email: value }))
                }
              />
              <Input
                label="Joined Date"
                type="date"
                value={memberForm.joinedDate}
                onChange={(value) =>
                  setMemberForm((prev) => ({ ...prev, joinedDate: value }))
                }
              />
              {memberMessage ? (
                <p
                  className={`rounded-lg border px-3 py-2 text-xs ${
                    memberMessageKind === "error"
                      ? "border-rose-400/40 bg-rose-500/10 text-rose-200"
                      : "border-cyan-200/20 bg-cyan-400/5 text-cyan-200"
                  }`}
                >
                  {memberMessage}
                </p>
              ) : null}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveMember}
                  disabled={savingMember}
                  className="flex-1 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
                >
                  {savingMember
                    ? editingMemberId
                      ? "Saving..."
                      : "Publishing..."
                    : editingMemberId
                      ? "Update Member"
                      : "Publish Member"}
                </button>
                {editingMemberId ? (
                  <button
                    type="button"
                    onClick={cancelEditMember}
                    disabled={savingMember}
                    className="rounded-lg border border-cyan-200/30 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-300/10 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-5">
            <h2 className="text-xl font-semibold text-cyan-200">
              Published Members
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Click Edit to update any member's details.
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              {members.map((member) => (
                <li
                  key={member.id}
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 ${
                    editingMemberId === member.id
                      ? "border-amber-300/50 bg-amber-400/5"
                      : "border-cyan-200/15"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-lg border border-cyan-200/20">
                      <Image
                        src={member.passport}
                        alt={member.fullName}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        {member.fullName}
                      </p>
                      <p className="text-xs text-amber-300">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEditMember(member)}
                      className="rounded-lg border border-amber-300/40 px-3 py-1 text-xs text-amber-200 hover:bg-amber-300/10"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMember(member.id)}
                      className="rounded-lg border border-rose-400/40 px-3 py-1 text-xs text-rose-200 hover:bg-rose-400/10"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
              {members.length === 0 ? (
                <li className="rounded-xl border border-dashed border-cyan-200/20 p-6 text-center text-xs text-slate-400">
                  No members yet.
                </li>
              ) : null}
            </ul>
          </section>
        </div>
      ) : null}

      {memberCropperSrc ? (
        <ImageCropper
          imageSrc={memberCropperSrc}
          aspect={1}
          title="Crop passport photo"
          subtitle="Pan and zoom to fit perfectly into the square display card."
          maxDim={600}
          quality={0.85}
          onCancel={() => {
            setMemberCropperSrc("");
            setMemberPassportFile(null);
            setMemberMessage("Passport upload cancelled.");
          }}
          onApply={(dataUrl) => {
            setMemberCroppedData(dataUrl);
            setMemberPassportPreview(dataUrl);
            setMemberCropperSrc("");
            setMemberMessage("Passport cropped. Click Publish to save.");
          }}
        />
      ) : null}

      {eventCropperSrc ? (
        <ImageCropper
          imageSrc={eventCropperSrc}
          aspect={16 / 9}
          title="Crop event banner"
          subtitle="Pan and zoom to frame the banner as it will appear on the site."
          maxDim={1200}
          quality={0.8}
          onCancel={() => {
            setEventCropperSrc("");
            setEventBannerFile(null);
            setEventMessage("Banner upload cancelled.");
          }}
          onApply={(dataUrl) => {
            setEventCroppedData(dataUrl);
            setEventBannerPreview(dataUrl);
            setEventCropperSrc("");
            setEventMessage("Banner cropped. Click Publish to save.");
          }}
        />
      ) : null}
    </section>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <article className="glass-card rounded-2xl p-4">
      <p className="text-xs uppercase tracking-wider text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </article>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "date";
}) {
  return (
    <label className="block text-xs text-slate-300">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-cyan-300/25 bg-slate-900 p-2 text-sm text-white outline-none focus:border-cyan-300"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-xs text-slate-300">
      {label}
      <textarea
        value={value}
        rows={3}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-cyan-300/25 bg-slate-900 p-2 text-sm text-white outline-none focus:border-cyan-300"
      />
    </label>
  );
}

function FileInput({
  label,
  onChange,
  preview,
  square = false,
  onRecrop,
}: {
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  preview: string;
  square?: boolean;
  onRecrop?: () => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs text-slate-300">
        {label}
        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          className="mt-1 w-full rounded-lg border border-cyan-300/25 bg-slate-900 p-2 text-sm text-white outline-none file:mr-3 file:rounded-md file:border-0 file:bg-cyan-500 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-slate-950 hover:file:bg-cyan-400"
        />
      </label>
      {preview ? (
        <div className="flex items-start gap-3">
          <div
            className={`overflow-hidden border border-cyan-300/25 ${
              square ? "h-24 w-24 rounded-xl" : "h-32 w-48 rounded-xl"
            }`}
          >
            <Image
              src={preview}
              alt="Preview"
              width={square ? 96 : 640}
              height={square ? 96 : 160}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
          {onRecrop ? (
            <button
              type="button"
              onClick={onRecrop}
              className="inline-flex items-center gap-1 self-start rounded-lg border border-amber-300/40 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-300/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path d="M6 6h12v12H6z" />
                <path d="M3 9h3M3 15h3M9 3v3M15 3v3M9 21v-3M15 21v-3M21 9h-3M21 15h-3" />
              </svg>
              Re-crop
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
