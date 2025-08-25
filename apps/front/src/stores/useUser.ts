import { create } from "zustand"

const apiUrl = import.meta.env.VITE_API_URL


export interface User {
  id: string;
  fullname: string;
  email: string;
  status: string; 
  roles: { id: string; name: string }[];
}

interface UserState {
  users: User[];
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  fetchUser: (id: string) => Promise<void>;
  fetchFormationUsers: (id: string) => Promise<void>;
  createUser: (user: Omit<User, "id" | "roles"> & { password: string }) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
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

  createUser: async (newUser) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${apiUrl}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newUser),
      });
      if (!res.ok) throw new Error("Failed to create user");
      await get().fetchUsers(); // refresh
      set({ loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  updateUser: async (id, updatedUser) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${apiUrl}/user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedUser),
      });
      if (!res.ok) throw new Error("Failed to update user");
      await get().fetchUsers();
      set({ loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${apiUrl}/user/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  
}))