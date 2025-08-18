import { create } from "zustand"

const apiUrl = import.meta.env.VITE_API_URL


export interface Tag {
  id: string;
  name: string;
}

interface TagState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
  fetchTags: () => Promise<void>;
  fetchTag: (id: string) => Promise<void>;
  fetchFormationTags: (id: string) => Promise<void>;
}

export const useTagStore = create<TagState>((set) => ({
  Tags: [],
  tag: null,
  loading: false,
  error: null,

  fetchTags: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${apiUrl}/tags`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      set({ tags: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Erreur", loading: false });
    }
  },

  fetchTag: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${apiUrl}/tag/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      set({ tag: data, loading: false });
    } catch (err: any) {

      set({ error: err.message || "Erreur", loading: false });
    }
  },

  fetchFormationTags: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${apiUrl}/formation/${id}/tags`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      set({ tags: data, loading: false });
    } catch (err: any) {

      set({ error: err.message || "Erreur", loading: false });
    }
  },
  
}))