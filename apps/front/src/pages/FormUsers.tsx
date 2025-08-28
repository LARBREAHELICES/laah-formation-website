'use client'
import { useEffect, useState } from 'react'
import { useUserStore } from '@/stores/useUser'
import { useRoleStore } from '@/stores/useRole'
import { useFormationStore } from '@/stores/useFormation'
import { useNavigate } from '@tanstack/react-router'

export default function NewUserPage() {
  const navigate = useNavigate()

  const { createUser } = useUserStore()
  const { roles: allRoles, fetchRoles, loading } = useRoleStore()
  const { formationsShort: formations, fetchFormationsShort } = useFormationStore()
  const [triedToSubmit, setTriedToSubmit] = useState(false)

  const [formData, setFormData] = useState({
    id: '',
    email: '',
    username: '',
    fullname: '',
    password: '',
    status: 'active' as 'active' | 'inactive',
    roles: [] as { id: string; name: string }[],
    formations: [] as { id: string; title: string }[],
  })

  const requiredFields: (keyof typeof formData)[] = [
  'username',
  'fullname', 
  'email',
  'roles'
]

useEffect(() => {
  fetchRoles()
}, [fetchRoles])

useEffect(() => {
  fetchRoles()
  fetchFormationsShort()
}, [])

  const inputClass =
    'border rounded-lg p-3 w-full text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500'

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleRole = (role: { id: string; name: string }) => {
  setFormData(prev => {
    const exists = prev.roles.some(r => r.id === role.id);
    return {
      ...prev,
      roles: exists
        ? prev.roles.filter(r => r.id !== role.id)
        : [...prev.roles, role],
    };
  });
};

const toggleFormation = (formation: { id: string; title: string }) => {
  setFormData(prev => {
    const exists = prev.formations.some(f => f.id === formation.id);
    return {
      ...prev,
      formations: exists
        ? prev.formations.filter(f => f.id !== formation.id)
        : [...prev.formations, formation],
    };
  });
};
const isFormValid = () => {
  return requiredFields.every(field => {
    const value = formData[field]

    
    if (Array.isArray(value)) {
      return value.length > 0
    }
    
    return value !== '' && value !== null && value !== undefined
  })
}
  

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  setTriedToSubmit(true)
  
  if (!isFormValid()) return

  createUser(formData)
  navigate({ to: '/crud/users' })
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
          Nouvel Utilisateur
        </h1>

        <form onSubmit={handleSubmit} className="mt-12 space-y-10">
          {/* --- Infos principales --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'email', label: 'Email', type: 'email' },
              { name: 'username', label: "Nom d'utilisateur", type: 'text' },
              { name: 'fullname', label: 'Nom complet', type: 'text' },
              { name: 'password', label: 'Mot de passe', type: 'password' },
              {
                name: 'status',
                label: 'Statut',
                type: 'select',
                options: ['active', 'inactive'],
              },
            ].map(field => (
              <div key={field.name} className="flex flex-col space-y-2">
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {field.label}
                </label>
                {field.type === 'select' ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleChange}
                    className={inputClass}
                  />
                )}
              </div>
            ))}
          </div>

<div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-4">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rôles</h3>
  {loading ? (
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
<div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-4">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Formations</h3>
  <div className="flex flex-wrap gap-3">
    {formations.map(formation => (
      <button
        type="button"
        key={formation.id}
        onClick={() => toggleFormation(formation)}
        className={`px-3 py-1 rounded-full text-sm border transition-colors
          ${
            formData.formations.some(f => f.id === formation.id)
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
      >
        {formation.title}
      </button>
    ))}
  </div>
</div>

{triedToSubmit && !isFormValid() && (
  <p className="text-sm text-red-600 text-center">
    Veuillez remplir tous les champs obligatoires avant d'enregistrer.
  </p>
)}

          {/* --- Bouton final --- */}
          <div className="text-center">
           <button
  type="submit"
  disabled={!isFormValid()}
  className={`w-full md:w-auto rounded-lg py-3 px-6 text-sm font-semibold shadow-md transition-opacity
    ${isFormValid()
      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90'
      : 'bg-gray-400 text-gray-700 cursor-not-allowed'
    }`}
>
  Enregistrer l'utilisateur
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
