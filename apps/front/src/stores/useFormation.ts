// src/stores/formationStore.ts
import { create } from "zustand";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Formation {
  id: string;
  title: string;
  slug: string;
  description: string;
  objectives: string;
  prerequisites: string;
  duration_hours: number;
  pedagogy_methods: string;
  evaluation_methods: string;
  qualiopi_certificate_number: string;
  qualiopi_certificate_date: string;
  sessions: any[];
  modules: any[];
  trainers: any[];
  attachments: any[];
}

interface FormationState {
  formations: Formation[];
  formation: Formation | null;
  loading: boolean;
  error: string | null;
  fetchFormations: () => Promise<void>;
  fetchFormation: (id: string) => Promise<void>;
}

export const useFormationStore = create<FormationState>((set) => ({
  formations: [],
  formation: null,
  loading: false,
  error: null,

  fetchFormations: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${apiUrl}/formations`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      set({ formations: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Erreur", loading: false });
    }
  },

  fetchFormation: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${apiUrl}/formation/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      set({ formation: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Erreur", loading: false });
    }
  },
}))