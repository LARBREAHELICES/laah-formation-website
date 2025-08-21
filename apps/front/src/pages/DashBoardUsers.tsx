'use client'
import { useEffect } from 'react'
import { useUserStore } from '@/stores/useUser'
import { Link } from '@tanstack/react-router'

export default function DashboardUsers() {
  const { users, loading, error, fetchUsers, deleteUser } = useUserStore()

  useEffect(() => { fetchUsers() }, [fetchUsers])
  if (loading) return <p className="text-center py-10">Chargement…</p>
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>

  const handleDelete = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      deleteUser(id)
    }
  }

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
        {/* Titre + bouton ajouter */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Dashboard des Utilisateurs
          </h2>
          <Link
            to="/crud/users/new"
            className="rounded-lg bg-indigo-600 dark:bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            + Ajouter
          </Link>
        </div>

        {/* Tableau */}
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
  <tr>
     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom Complet</th>
    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Statut</th>
    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
  </tr>
</thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
  {users.map((u) => (
    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{u.fullname}</td>
      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{u.email}</td>
      <td className="px-4 py-3 text-sm">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          u.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {u.status}
        </span>
      </td>
      <td className="px-4 py-3 text-right flex justify-end gap-2">
        <Link 
          to={`/crud/users/${u.id}/edit`}
          className="rounded-md bg-yellow-500 px-3 py-1 text-xs font-semibold text-white hover:bg-yellow-400"
        >
          Modifier
        </Link>
        <button
          onClick={() => handleDelete(u.id)}
          className="rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500"
        >
          Supprimer
        </button>
      </td>
    </tr>
  ))}

  {users.length === 0 && (
    <tr>
      <td colSpan={4} className="text-center py-6 text-gray-500 dark:text-gray-400">
        Aucun utilisateur trouvé.
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
