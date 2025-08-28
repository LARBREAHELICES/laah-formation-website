// src/stores/useInscriptionStore.ts
import { create } from 'zustand'

export interface InscriptionPayload {
  formationId: string 
  sessionId: string
  firstname: string
  lastname: string
  email: string
  countryCode: string
  phoneNumber: string
  message: string
}

interface InscriptionStore {
  isSubmitting: boolean
  error: string | null
  response: any | null

  submitInscription: (payload: InscriptionPayload) => Promise<void>
}

export const useInscriptionStore = create<InscriptionStore>((set) => ({
  isSubmitting: false,
  error: null,
  response: null,

  async submitInscription(payload) {
    set({ isSubmitting: true, error: null, response: null })

    try {
      const res = await fetch('/api/inscriptions', {
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
}))