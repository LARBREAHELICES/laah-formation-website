import { create } from "zustand"

const apiUrl = import.meta.env.VITE_API_URL

export interface FormationsShort {
  id: string; 
  title: string;
}

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
  rate: number;
  sessions: any[];
  modules: any[];
  trainers: any[];
  attachments: any[];
}

interface FormationState {
  formations: Formation[];
  formationsShort: FormationsShort [];
  formation: Formation | null;
  loading: boolean;
  error: string | null;
  fetchFormations: () => Promise<void>;
  fetchFormation: (id: string) => Promise<void>;
  fetchFormationsShort: () => Promise<void>;
  createFormation: (formation: Formation) => Promise<void>;
  deleteFormation: (id: string) => Promise<void>;
  updateFormation: (formation: Formation) => Promise<void>;
  
}

export const useFormationStore = create<FormationState>((set, get) => ({
  formations: [],
  formationsShort: [],
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
      console.log("Fetching:", `${apiUrl}/formations/${id}`);

      set({ error: err.message || "Erreur", loading: false });
    }
  },

    fetchFormationsShort: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${apiUrl}/formations/short`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      set({ formationsShort: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Erreur", loading: false });
    }
  },
  
  createFormation: async (formation: Formation) => {  
    set({ loading: true });
    try {
      const res = await fetch(`${apiUrl}/formation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formation),
      })
      if (!res.ok) throw new Error("Failed to create planning");

      const newFormation = await res.json()

      set((state) => ({
        formations: [...state.formations, newFormation],
        loading: false,
      }))
    } catch (error) {
      console.error("Error creating formation:", error)

      set({ loading: false })
    }
  },
  deleteFormation: async (id: string) => {
    set({ loading: true });
    try {
      const res = await fetch(`${apiUrl}/formation/${id}`, {
        method: "DELETE",
        credentials: "include", // important pour envoyer le cookie
      })
      if (!res.ok) throw new Error("Failed to delete formation");

      set((state) => ({
        formations: state.formations.filter((p) => p.id !== id),
        loading: false,
      }))
    } catch (error) {
      console.error("Error deleting formation:", error)

      set({ loading: false })
    }
  },
  updateFormation: async (formation: Formation) => {
    
    set({ loading: true });
    try {
      const res = await fetch(`${apiUrl}/formation/${formation.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formation),
      })
      if (!res.ok) throw new Error("Failed to update formation");

      const updatedFormation = await res.json()

      set((state) => ({
        formations: state.formations.map((p) =>
          p.id === updatedFormation.id ? updatedFormation : p
        ),
        loading: false,
      }))
    } catch (error) {
      console.error("Error updating formation:", error)

      set({ loading: false })
    }
  },
}))