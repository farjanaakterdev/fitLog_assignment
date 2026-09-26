"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Workout } from "./types";

const PLAN_CAP = 5;
const STORAGE_KEY = "fitlog.v1";

type Toast = { id: number; message: string; tone: "success" | "info" | "error" };

type Persisted = { plan: Workout[]; saved: Workout[]; doneIds: number[] };

type Store = {
  plan: Workout[];
  saved: Workout[];
  doneIds: number[];
  planFull: boolean;
  addToPlan: (w: Workout) => boolean;
  addToSaved: (w: Workout) => boolean;
  removeFromPlan: (id: number) => void;
  removeFromSaved: (id: number) => void;
  markDone: (id: number) => void;
  toast: (message: string, tone?: "success" | "info" | "error") => void;
  toasts: Toast[];
};

const Ctx = createContext<Store | null>(null);

export function useStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

const EMPTY: Persisted = { plan: [], saved: [], doneIds: [] };

let cache: Persisted = EMPTY;
const listeners = new Set<() => void>();

function readStorage(): Persisted {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return {
      plan: Array.isArray(parsed.plan) ? parsed.plan : [],
      saved: Array.isArray(parsed.saved) ? parsed.saved : [],
      doneIds: Array.isArray(parsed.doneIds) ? parsed.doneIds : [],
    };
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): Persisted {
  return cache;
}

function getServerSnapshot(): Persisted {
  return EMPTY;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    cache = readStorage();
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", handleStorage);
      cache = EMPTY;
    }
  };
}

function handleStorage(event: StorageEvent) {
  if (event.key && event.key !== STORAGE_KEY) return;
  cache = readStorage();
  emit();
}

function emit() {
  listeners.forEach((listener) => listener());
}

function commit(next: Persisted) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage may be unavailable */
  }
  emit();
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const toast = useCallback(
    (message: string, tone: Toast["tone"] = "success") => {
      const id = nextId.current++;
      setToasts((list) => [...list, { id, message, tone }]);
      window.setTimeout(() => {
        setToasts((list) => list.filter((t) => t.id !== id));
      }, 2600);
    },
    []
  );

  const addToPlan = useCallback((w: Workout) => {
    const current = getSnapshot();
    if (
      current.plan.some((item) => item.id === w.id) ||
      current.plan.length >= PLAN_CAP
    ) {
      return false;
    }
    commit({ ...current, plan: [...current.plan, w] });
    return true;
  }, []);

  const addToSaved = useCallback((w: Workout) => {
    const current = getSnapshot();
    if (current.saved.some((item) => item.id === w.id)) return false;
    commit({ ...current, saved: [...current.saved, w] });
    return true;
  }, []);

  const removeFromPlan = useCallback((id: number) => {
    const current = getSnapshot();
    commit({
      ...current,
      plan: current.plan.filter((item) => item.id !== id),
      doneIds: current.doneIds.filter((x) => x !== id),
    });
  }, []);

  const removeFromSaved = useCallback((id: number) => {
    const current = getSnapshot();
    commit({ ...current, saved: current.saved.filter((item) => item.id !== id) });
  }, []);

  const markDone = useCallback((id: number) => {
    const current = getSnapshot();
    if (current.doneIds.includes(id)) return;
    commit({ ...current, doneIds: [...current.doneIds, id] });
  }, []);

  const value = useMemo<Store>(
    () => ({
      plan: state.plan,
      saved: state.saved,
      doneIds: state.doneIds,
      planFull: state.plan.length >= PLAN_CAP,
      addToPlan,
      addToSaved,
      removeFromPlan,
      removeFromSaved,
      markDone,
      toast,
      toasts,
    }),
    [
      state,
      addToPlan,
      addToSaved,
      removeFromPlan,
      removeFromSaved,
      markDone,
      toast,
      toasts,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export { PLAN_CAP };
