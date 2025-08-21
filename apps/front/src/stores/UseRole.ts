import { create } from "zustand"

const apiUrl = import.meta.env.VITE_API_URL


export interface Role {
  id: string;
  name: string;
}

interface RoleState {
  roles: Role[];
  role: Role | null;
  loading: boolean;
  error: string | null;
rolesByUser: Record<string, Role[]>;
  fetchRoles: () => Promise<void>;
  fetchRole: (id: string) => Promise<void>;
  fetchUserRoles: (userId: string) => Promise<void>
}

export const useRoleStore = create<RoleState>((set) => ({
  roles: [],
  role: null,
   rolesByUser: {},
  loading: false,
  error: null,

  fetchRoles: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${apiUrl}/roles`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      set({ roles: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Erreur", loading: false });
    }
  },

  fetchRole: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${apiUrl}/role/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      set({ role: data, loading: false });
    } catch (err: any) {

      set({ error: err.message || "Erreur", loading: false });
    }
  },

fetchUserRoles: async (userId: string) => {
    try {
      const res = await fetch(`${apiUrl}/user/${userId}/roles`, {
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to fetch roles")
      const data = await res.json()
      set((state) => ({
        rolesByUser: { ...state.rolesByUser, [userId]: data },
      }))
    } catch (err) {
      console.error(err)
    }
  },
}))