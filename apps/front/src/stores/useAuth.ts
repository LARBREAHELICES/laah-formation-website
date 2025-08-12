import { create } from "zustand"

const apiUrl = import.meta.env.VITE_API_URL

type User = {
  id: string;
  email: string;
  username: string;
  fullname: string;
  roles: string[];
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (username :string, password : string) => {
    set({ isLoading: true, error: null });
    console.log(JSON.stringify({ username, password }))
    try {
      const res = await fetch(`${apiUrl}/token`, {
        method: "POST",
        credentials: "include", // indispensable pour HttpOnly cookie
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      // Après login, on recharge le profil
      await useAuthStore.getState().fetchMe();
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMe: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${apiUrl}/auth/me`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Unable to fetch user");
      const data: User = await res.json();
      set({ user: data });
    } catch (err: any) {
      set({ user: null, error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await fetch(`${apiUrl}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    set({ user: null });
  },
}))
