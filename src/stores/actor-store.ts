/**
 * Admin actor store — in a real app this would be backed by NextAuth session.
 * For this demo, the actor is the first super_admin user fetched at admin mount.
 */
import { create } from "zustand";

interface ActorState {
  actorId: string | null;
  actorName: string | null;
  actorRole: "super_admin" | "manager" | "operator" | null;
  setActor: (a: { id: string; name: string; role: "super_admin" | "manager" | "operator" }) => void;
  clearActor: () => void;
}

export const useActorStore = create<ActorState>((set) => ({
  actorId: null,
  actorName: null,
  actorRole: null,
  setActor: (a) =>
    set({ actorId: a.id, actorName: a.name, actorRole: a.role }),
  clearActor: () => set({ actorId: null, actorName: null, actorRole: null }),
}));
