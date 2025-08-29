// src/pages/RegistrationDashboardPage.tsx
'use client'

import { useEffect } from 'react'
import { useInscriptionStore } from '@/stores/useRegistration'

export default function RegistrationDashboardPage() {
  const { 
    pendingRequests, 
    isLoadingPending, 
    error, 
    fetchPending 
  } = useInscriptionStore()

  useEffect(() => {
    fetchPending()
  }, [fetchPending])

  const handleApprove = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir approuver cette demande ?')) {
      try {
        const res = await fetch(`/api/registration/${id}/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) throw new Error('Erreur lors de l\'approbation')
        await fetchPending()
      } catch (err) {
        alert('Erreur: ' + err)
      }
    }
  }

  const handleReject = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir rejeter cette demande ?')) {
      try {
        const res = await fetch(`/api/registration/${id}/reject`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) throw new Error('Erreur lors du rejet')
        await fetchPending()
      } catch (err) {
        alert('Erreur: ' + err)
      }
    }
  }

  if (isLoadingPending) return <p className="text-center py-10">Chargement…</p>
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>

  return (
    <section className="relative isolate bg-white dark:bg-gray-900 overflow-hidden py-16 sm:py-24">
      {/* Dégradé haut */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 dark:opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Titre */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Demandes d'inscription en attente
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {pendingRequests?.length || 0} demande(s) en attente de validation
          </p>
        </div>

        {/* Tableau */}
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Motivation</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {pendingRequests?.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{request.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{request.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate" title={request.motivation}>{request.motivation}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{new Date(request.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="rounded-md bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-500"
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500"
                    >
                      Rejeter
                    </button>
                  </td>
                </tr>
              ))}

              {pendingRequests?.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500 dark:text-gray-400">
                    Aucune demande d'inscription en attente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dégradé bas */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 dark:opacity-10 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </section>
  )
}