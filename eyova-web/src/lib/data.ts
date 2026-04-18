export type EventStatus = "UPCOMING" | "PASSED";

export type ClubEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  status: EventStatus;
  banner: string;
  time?: string;
  host?: string;
  contact?: string;
  details?: string;
};

export type Member = {
  id: string;
  fullName: string;
  role: string;
  passport: string;
  bio: string;
  email: string;
  joinedDate: string;
};

export const events: ClubEvent[] = [
  {
    id: "ev-001",
    title: "Innovation Mixer 2026",
    description:
      "Networking session where members share startup ideas and collaborate across teams.",
    location: "Lagos Innovation Hub",
    date: "2026-05-12T16:00:00.000Z",
    status: "UPCOMING",
    banner: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1280&q=80",
  },
  {
    id: "ev-002",
    title: "Community Outreach Day",
    description:
      "Volunteer outreach program focused on youth mentorship and practical digital skills.",
    location: "Ikoyi Community Center",
    date: "2026-03-28T09:00:00.000Z",
    status: "PASSED",
    banner: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1280&q=80",
  },
  {
    id: "ev-003",
    title: "Executive Strategy Retreat",
    description:
      "Leadership planning workshop to define strategic goals for the next season.",
    location: "Lekki Phase 1",
    date: "2026-06-08T10:30:00.000Z",
    status: "UPCOMING",
    banner: "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=1280&q=80",
  },
];

export const members: Member[] = [
  {
    id: "mb-001",
    fullName: "Amina Yusuf",
    role: "President",
    passport:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=640&q=80",
    bio: "Community builder with 8+ years leading youth and social development initiatives.",
    email: "amina.yusuf@eyova.club",
    joinedDate: "2022-01-15",
  },
  {
    id: "mb-002",
    fullName: "Daniel Okoye",
    role: "Events Coordinator",
    passport:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=640&q=80",
    bio: "Coordinates workshops, networking mixers, and collaborative member events.",
    email: "daniel.okoye@eyova.club",
    joinedDate: "2023-04-04",
  },
  {
    id: "mb-003",
    fullName: "Ifeoma Nnaji",
    role: "Secretary",
    passport:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=640&q=80",
    bio: "Maintains club records and ensures smooth communication across all committees.",
    email: "ifeoma.nnaji@eyova.club",
    joinedDate: "2024-02-20",
  },
];

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getDashboardStats() {
  const upcomingCount = events.filter((event) => event.status === "UPCOMING").length;
  const passedCount = events.filter((event) => event.status === "PASSED").length;
  return {
    totalMembers: members.length,
    totalEvents: events.length,
    upcomingCount,
    passedCount,
  };
}
