import { create } from "zustand"

const apiUrl = import.meta.env.VITE_API_URL


export interface User {
  id: string;
  fullname: string;
  email: string;
  status: boolean;
}

interface UserState {
  users: User[];
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  fetchUser: (id: string) => Promise<void>;
  fetchFormationUsers: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  user: null,
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${apiUrl}/users`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      set({ users: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Erreur", loading: false });
    }
  },

  fetchUser: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${apiUrl}/user/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      set({ user: data, loading: false });
    } catch (err: any) {

      set({ error: err.message || "Erreur", loading: false });
    }
  },

  fetchFormationUsers: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${apiUrl}/formation/${id}/users`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      set({ users: data, loading: false });
    } catch (err: any) {

      set({ error: err.message || "Erreur", loading: false });
    }
  },
  
}))