"use client";

import { useEffect, useState } from "react";
import {
  events as seedEvents,
  members as seedMembers,
} from "@/lib/data";
import type { ClubEvent, Member } from "@/lib/data";
import {
  subscribeEvents,
  subscribeGallery,
  subscribeMembers,
  type GalleryImage,
} from "@/lib/content-store";
import { COMMUNITY_PHOTOS } from "@/lib/community-photos";

export function useEvents() {
  const [events, setEvents] = useState<ClubEvent[]>(seedEvents);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeEvents(
      (items) => {
        setEvents(items.length > 0 ? items : seedEvents);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);

  return { events, loading, error };
}

export function useMembers() {
  const [members, setMembers] = useState<Member[]>(seedMembers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeMembers(
      (items) => {
        setMembers(items.length > 0 ? items : seedMembers);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);

  return { members, loading, error };
}

export function useGallery() {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeGallery(
      (items) => {
        setGallery(items);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);

  const carouselImages =
    gallery.length > 0
      ? [...gallery.map((img) => img.url), ...COMMUNITY_PHOTOS]
      : COMMUNITY_PHOTOS;

  return { gallery, carouselImages, loading, error };
}
