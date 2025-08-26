'use client'
import { useEffect, useState } from 'react'
import { useUserStore } from '@/stores/useUser'
import { useRoleStore } from '@/stores/useRole'
import { useFormationStore } from '@/stores/useFormation'
import { useNavigate, useParams } from '@tanstack/react-router'

export default function EditUserPage() {
  const navigate = useNavigate()
  const { id } = useParams({ strict: false })

  const { user, fetchUser, updateUser } = useUserStore()
  const { roles: allRoles, fetchRoles, loading: loadingRoles } = useRoleStore()
  const { formations: allFormations, fetchFormations } = useFormationStore()

  const [formData, setFormData] = useState({
    id: '',
    email: '',
    username: '',
    fullname: '',
    status: 'active' as 'active' | 'inactive',
    roles: [] as { id: string; name: string }[],     
  })

  const inputClass =
    'border rounded-lg p-3 w-full text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500'
  const cardClass =
    'p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-4'

  /* ------------------ chargement données ------------------ */
  useEffect(() => {
    if (id) {
      fetchUser(id)
      fetchFormations()
      fetchRoles()
    }
  }, [id, fetchUser, fetchFormations, fetchRoles])

  /* ------------------ remplissage des champs ------------------ */
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || '',
        email: user.email || '',
        fullname: user.fullname || '',
        status: user.status || 'active',
        roles: user.roles || [],   
      })
    }
  }, [user])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  /* toggle formation */
  const toggleFormation = (formationId: string) =>
    setFormData(prev => ({
      ...prev,
      formations: prev.formations.includes(formationId)
        ? prev.formations.filter(f => f !== formationId)
        : [...prev.formations, formationId],
    }))

const toggleRole = (role: { id: string; name: string }) =>
  setFormData(prev => {
    const exists = prev.roles.some(r => r.id === role.id)
    return {
      ...prev,
      roles: exists
        ? prev.roles.filter(r => r.id !== role.id)
        : [...prev.roles, role],
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUser(id!, formData)
    navigate({ to: '/crud/users' })
  }

  if (!user) {
    return (
      <p className="text-center py-10 text-gray-500 dark:text-gray-400">
        Chargement…
      </p>
    )
  }

  return (
    <section className="relative isolate bg-white dark:bg-gray-900 overflow-hidden py-16 sm:py-24">
       {/* top blurred blob */}
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
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
          Modifier l’utilisateur
        </h1>

        <form onSubmit={handleSubmit} className="mt-12 space-y-10">
          {/* --- Infos principales --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'email', placeholder: 'Email', type: 'email' },
              { name: 'fullname', placeholder: 'Nom complet', type: 'text' },
              {
                name: 'status',
                placeholder: 'Statut',
                type: 'select',
                options: ['active', 'inactive', 'banned'],
              },
            ].map(field =>
              field.type === 'select' ? (
                <select
                  key={field.name}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {field.options?.map(opt => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  key={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  className={inputClass}
                />
              )
            )}
          </div>

          {/* --- Rôles (boutons comme dans NewUserPage) --- */}
          <div className={cardClass}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rôles</h3>
            {loadingRoles ? (
              <p className="text-gray-500">Chargement…</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {allRoles.map(role => (
                  <button
                    type="button"
                    key={role.id}
                    onClick={() => toggleRole(role)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors
                      ${
                        formData.roles.some(r => r.id === role.id)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    {role.name}
                  </button>
                ))}
              </div>
            )}
          </div>


          {/* --- Bouton final --- */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full md:w-auto rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 py-3 px-6 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
       {/* bottom blurred blob */}
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
