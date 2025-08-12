import React, { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/useAuth' // adapte le chemin

export const Route = createFileRoute('/logouttest')({
  component: RouteComponent,
})

function RouteComponent() {
  const logout = useAuthStore(state => state.logout)
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function doLogout() {
      try {
        await logout()
        navigate('/') // redirige vers la page d’accueil après déconnexion
      } catch (err: any) {
        setError(err.message || 'Logout failed')
      } finally {
        setLoading(false)
      }
    }
    doLogout()
  }, [logout, navigate])

  if (loading) return <div>Déconnexion en cours...</div>
  if (error) return <div>Erreur lors de la déconnexion : {error}</div>

  return <div>Déconnecté.</div>
}
