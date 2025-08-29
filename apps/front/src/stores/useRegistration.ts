// src/stores/useInscriptionStore.ts
import { create } from 'zustand'

export interface InscriptionPayload {
  formationId: string 
  sessionId: string
  name: string
  email: string
  motivation: string
}

export interface RegistrationRequest {
  id: string
  name: string
  email: string
  motivation: string
  status: string
  created_at: string
}

interface InscriptionStore {
  isSubmitting: boolean
  error: string | null
  response: any | null

  pendingRequests: RegistrationRequest[] | null
  isLoadingPending: boolean

  submitInscription: (payload: InscriptionPayload) => Promise<void>
  fetchPending: () => Promise<void>
}

export const useInscriptionStore = create<InscriptionStore>((set) => ({
  isSubmitting: false,
  error: null,
  response: null,

  pendingRequests: null,
  isLoadingPending: false,

  async submitInscription(payload) {
    set({ isSubmitting: true, error: null, response: null })

    try {
      const res = await fetch('/api/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || res.statusText)
      }

      const data = await res.json()
      set({ response: data, isSubmitting: false })
    } catch (err: any) {
      set({ error: err.message || 'Erreur inconnue', isSubmitting: false })
    }
  },

  async fetchPending() {
    set({ isLoadingPending: true, error: null })
    try {
      const res = await fetch('/api/registration?status=pending')
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      set({ pendingRequests: data, isLoadingPending: false })
    } catch (err: any) {
      set({ error: err.message || 'Impossible de charger les demandes', isLoadingPending: false })
    }
  },
}))
