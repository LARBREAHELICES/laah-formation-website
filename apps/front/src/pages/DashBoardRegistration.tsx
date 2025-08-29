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
        await fetchPending() // Recharger la liste
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
        await fetchPending() // Recharger la liste
      } catch (err) {
        alert('Erreur: ' + err)
      }
    }
  }

  if (isLoadingPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Demandes d'inscription en attente
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {pendingRequests?.length || 0} demande(s) en attente de validation
            </p>
          </div>

          {error && (
            <div className="px-6 py-4 bg-red-50 text-red-700">
              Erreur: {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motivation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingRequests?.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {request.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{request.email}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-sm text-gray-700 truncate" title={request.motivation}>
                        {request.motivation}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="text-green-600 hover:text-green-900 font-medium"
                        >
                          Approuver
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Rejeter
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pendingRequests?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune demande en attente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}