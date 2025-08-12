import { create } from "zustand";

const apiUrl = import.meta.env.VITE_API_URL;

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
  refreshToken: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => {
  // Wrapper fetch avec gestion automatique du refresh token
  async function fetchWithRefresh(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const { refreshToken, logout } = get();

    let res = await fetch(input, { credentials: "include", ...init });

    if (res.status === 401) {
      try {
        await refreshToken();
        // Refaire la requête après refresh
        res = await fetch(input, { credentials: "include", ...init });
      } catch {
        // Échec du refresh => déconnexion
        await logout();
        throw new Error("Session expired, please login again.");
      }
    }

    return res;
  }

  return {
    user: null,
    isLoading: false,
    error: null,

    login: async (username: string, password: string) => {
      set({ isLoading: true, error: null });
      try {
        const res = await fetch(`${apiUrl}/token`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        if (!res.ok) throw new Error("Invalid credentials");

        await get().fetchMe();
      } catch (err: any) {
        set({ error: err.message });
      } finally {
        set({ isLoading: false });
      }
    },

    fetchMe: async () => {
      set({ isLoading: true, error: null });
      try {
        const res = await fetchWithRefresh(`${apiUrl}/auth/me`);
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

    refreshToken: async () => {
      set({ isLoading: true, error: null });
      try {
        const res = await fetch(`${apiUrl}/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Unable to refresh token");

        // On recharge le profil utilisateur
        await get().fetchMe();
      } catch (err: any) {
        set({ user: null, error: err.message });
        throw err; // rejette pour que fetchWithRefresh puisse gérer
      } finally {
        set({ isLoading: false });
      }
    },
  };
});
