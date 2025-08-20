import { create } from "zustand"

const apiUrl = import.meta.env.VITE_API_URL


export interface Module {
    id: string;   
    title: string,
    duration_hours: number,
    description: string,
    order_index: number
}

interface ModuleState {
  modules: Module[];
  module: Module | null;
  loading: boolean;
  error: string | null;
  fetchModules: () => Promise<void>;
  fetchModule: (id: string) => Promise<void>;
}

export const useModuleStore = create<ModuleState>((set) => ({
  modules: [],
  module: null,
  loading: false,
  error: null,

  fetchModules: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${apiUrl}/modules`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      set({ modules: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Erreur", loading: false });
    }
  },

  fetchModule: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${apiUrl}/module/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      set({ module: data, loading: false });
    } catch (err: any) {

      set({ error: err.message || "Erreur", loading: false });
    }
  },

  fetchFormationModules: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${apiUrl}/formation/${id}/modules`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      set({ tags: data, loading: false });
    } catch (err: any) {

      set({ error: err.message || "Erreur", loading: false });
    }
  },
}))