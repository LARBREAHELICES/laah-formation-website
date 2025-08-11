import { create } from "zustand"
import {  type AuthState } from "@/types/UserType"

const apiUrl = import.meta.env.VITE_API_URL

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  error: null,
  hasCheckedAuth: false,
  isLoadingAuth: true, // ← nouvelle clé

  login: async (username: string, password: string) => {
    try {
      const res = await fetch(`${apiUrl}/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // pour récupérer cookie refresh_token
      })

      if (!res.ok) throw new Error("Identifiants incorrects")

      const data = await res.json()

      set({
        user: {
          username: data.user,
          role: data.roles ? [ ...data.roles ] : null, // si vous gérez les rôles
        },
        accessToken: data.access_token,
        error: null,
        isLoadingAuth: false, // Authentification terminée
      })

      return true

    } catch (err: any) {
      set({ error: err.message || "Erreur lors de la connexion" })
      return false
    }
  },

  logout: async () => {
    try {
      await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      })
      set({ user: null, accessToken: null, error: null, hasCheckedAuth: false })
    } catch {
      set({ user: null, accessToken: null, error: "Erreur lors de la déconnexion", hasCheckedAuth: false })
    }
  },

  checkAuth: async () => {
    try {
      const res = await fetch(`${apiUrl}/auth/me`, {
        method: "GET",
        credentials: "include", // important pour envoyer le cookie
      })
  
      if (!res.ok) {
        // Pas connecté ou refresh token invalide
        set({ user: null, accessToken: null, error: "Non authentifié", isLoadingAuth: false })
        return null
      }

      const data = await res.json()

      const user = {
        username: data.username,
        role: data.roles || null,
      }
  
      set({
        user,
        accessToken: data.access_token,
        error: null,
        isLoadingAuth: false,
      })
  
      return user // Retourne l'utilisateur authentifié
  
    } catch (err) {
      set({ user: null, accessToken: null, error: "Erreur lors de la vérification", isLoadingAuth: false })
      return null
    }
  },

  refresh: async () => {
    try {
      const res = await fetch(`${apiUrl}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      })

      if (!res.ok) return false

      const data = await res.json() // data.access_token, data.user

      set({
        accessToken: data.access_token,
        user: {
          username: data.user.username,
          role: data.role.name || null, // si vous gérez les rôles
        },
        error: null,
      })

      return true

    } catch (err) {
      set({ user: null, accessToken: null, error: "Échec du refresh", hasCheckedAuth: false })
      return false
    }
  },
}))
