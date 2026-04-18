# Eyova Social Club

Web platform for the **Ebira Youths One Voice Association Abuja (EYOVA) Social Club**.
A modern nonprofit-style site with public pages, a members directory, an events showcase, a donation page, and a full admin console for publishing and editing content in real time.

Live site: **https://eyova-club.web.app**

---

## Features

### Public site
- Landing page with dynamic stats (members, events, years active), hero carousel, mission highlights, upcoming events, featured members, and CTAs.
- **What we do** page with programs, upcoming events, and past events — every event card is clickable and opens a detail modal with full description, date/time, location, host, and contact info.
- **Members** directory with search, role filter, large square passport cards, and a detail modal with bio and contact.
- **Donate** page with selectable amounts, bank transfer details (copy-to-clipboard), impact areas, and other ways to support.
- Branded 404 page with quick links back to core sections.
- Shared animated segmented-pill navigation (Home / What we do / Members / Donate) on every page.
- Admin login hidden as a subtle lock icon in the footer copyright bar.

### Admin console (`/admin`)
- Email + password login (`eyovaclub@gmail.com` / `admin321`) with `localStorage` session.
- **Overview** dashboard with live counts and recent items.
- **Events** — create / edit / delete. Fields: title, short description, full details, location, date, time, host, contact/RSVP, banner, status (Upcoming / Passed).
- **Members** — create / edit / delete. Fields: name, role, square passport photo, biography, email, joined date.
- **Interactive image cropper** on every image upload:
  - Pan, zoom, and fit passports into a perfect 1:1 square for the display card.
  - Crop event banners to a consistent 16:9 frame.
  - **Re-crop** button on existing previews so the admin can readjust without re-uploading.
- Inline editing (form prefills, Update/Cancel buttons) and real-time updates across all visitors via Firestore `onSnapshot`.

---

## Tech stack

- **Next.js 16** (App Router, Turbopack, static export)
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Firebase** (Firestore for data, Hosting for the site, Storage rules reserved)
- **react-easy-crop** for the image cropper
- Client-side image compression (`src/lib/image.ts`) — resizes and re-encodes to JPEG so passports and banners stay well under Firestore document limits.

---

## Getting started

Prerequisites: **Node.js 20+** and npm.

```bash
cd eyova-web
npm install
npm run dev
```

Open http://localhost:3000.

### Build & deploy

```bash
npm run build
npx firebase deploy --only hosting:<SITE_ID> --project <FIREBASE_PROJECT_ID>
```

The Firebase project ID and hosting site ID are configured in `eyova-web/.firebaserc` and `eyova-web/firebase.json`.

---

## Project structure

```
EYOVA Social Club/
├─ EYOVA_SOCIAL_CLUB_TECHNICAL_SPECIFICATION.txt   # Full technical spec + flow diagram
├─ logo1.jpg
└─ eyova-web/                                      # Next.js app
   ├─ src/
   │  ├─ app/
   │  │  ├─ page.tsx                 # Home
   │  │  ├─ what-we-do/              # Programs + events
   │  │  ├─ members/                 # Directory + modal
   │  │  ├─ donate/                  # Donation page
   │  │  ├─ admin/                   # Admin console + login
   │  │  ├─ not-found.tsx            # Branded 404
   │  │  └─ layout.tsx
   │  ├─ components/                 # site-header, site-footer, event-modal, image-cropper, ...
   │  ├─ hooks/                      # useEvents, useMembers (Firestore onSnapshot)
   │  └─ lib/                        # firebase, content-store, data, image (compress + crop)
   ├─ public/                        # eyova logo, favicons, banners
   ├─ firebase.json                  # Hosting config (static export, cleanUrls, 404)
   ├─ firestore.rules
   ├─ storage.rules
   └─ .firebaserc
```

---

## Admin credentials (default)

- Email: `eyovaclub@gmail.com`
- Password: `admin321`

Change these in `eyova-web/src/app/admin/login/page.tsx` and `eyova-web/src/lib/admin-auth.ts` before going fully public.

---

## License

© Eyova Social Club — Ebira Youths One Voice Association Abuja.
