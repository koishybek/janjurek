"use client";

import { useEffect, useMemo, useState } from "react";
import type { Person } from "@data/people";
import { people as seedPeople } from "@data/people";
import { fetchPeopleFromFirestore } from "@/lib/firestore-people";
import { isFirebaseConfigured } from "@/lib/firebase";

type UsePeopleDataState = {
  people: Person[];
  loading: boolean;
  error: string | null;
};

export function usePeopleData(): UsePeopleDataState {
  const [remotePeople, setRemotePeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return;
    }
    let cancelled = false;
    fetchPeopleFromFirestore()
      .then((list) => {
        if (!cancelled) {
          setRemotePeople(list);
        }
      })
      .catch((reason) => {
        if (!cancelled) {
          setError(reason instanceof Error ? reason.message : String(reason));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const merged = useMemo(() => {
    if (remotePeople.length === 0) {
      return seedPeople;
    }
    const map = new Map<string, Person>();
    for (const person of seedPeople) {
      map.set(person.id, person);
    }
    for (const person of remotePeople) {
      map.set(person.id, person);
    }
    return Array.from(map.values());
  }, [remotePeople]);

  return { people: merged, loading, error };
}
