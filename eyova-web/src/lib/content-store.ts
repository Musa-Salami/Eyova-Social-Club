"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { getDb, getStorageBucket } from "@/lib/firebase";
import type { ClubEvent, Member } from "@/lib/data";

const EVENTS_COLLECTION = "events";
const MEMBERS_COLLECTION = "members";

type FirestoreEvent = Omit<ClubEvent, "id">;
type FirestoreMember = Omit<Member, "id">;

export function subscribeEvents(
  callback: (events: ClubEvent[]) => void,
  onError?: (error: Error) => void,
) {
  const db = getDb();
  const q = query(
    collection(db, EVENTS_COLLECTION),
    orderBy("date", "desc"),
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const items: ClubEvent[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as FirestoreEvent),
      }));
      callback(items);
    },
    (error) => onError?.(error),
  );
}

export function subscribeMembers(
  callback: (members: Member[]) => void,
  onError?: (error: Error) => void,
) {
  const db = getDb();
  const q = query(
    collection(db, MEMBERS_COLLECTION),
    orderBy("joinedDate", "desc"),
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const items: Member[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as FirestoreMember),
      }));
      callback(items);
    },
    (error) => onError?.(error),
  );
}

export async function createEvent(data: FirestoreEvent) {
  const db = getDb();
  return addDoc(collection(db, EVENTS_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function deleteEvent(id: string) {
  const db = getDb();
  return deleteDoc(doc(db, EVENTS_COLLECTION, id));
}

export async function updateEvent(
  id: string,
  data: Partial<FirestoreEvent>,
) {
  const db = getDb();
  return updateDoc(doc(db, EVENTS_COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function createMember(data: FirestoreMember) {
  const db = getDb();
  return addDoc(collection(db, MEMBERS_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function deleteMember(id: string) {
  const db = getDb();
  return deleteDoc(doc(db, MEMBERS_COLLECTION, id));
}

export async function updateMember(
  id: string,
  data: Partial<FirestoreMember>,
) {
  const db = getDb();
  return updateDoc(doc(db, MEMBERS_COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function uploadImage(
  folder: "members" | "events",
  file: File,
): Promise<string> {
  const storage = getStorageBucket();
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const fileRef = storageRef(storage, path);
  await uploadBytes(fileRef, file, { contentType: file.type });
  return getDownloadURL(fileRef);
}
