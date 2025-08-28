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
  const { formationsShort: allFormations, fetchFormationsShort } = useFormationStore()
  const [triedToSubmit, setTriedToSubmit] = useState(false)

  const [formData, setFormData] = useState({
    id: '',
    email: '',
    username: '',
    fullname: '',
    status: 'active' as 'active' | 'inactive',
    roles: [] as { id: string; name: string }[],
    formationsShort: [] as { id: string; title: string }[],
  })

  const requiredFields: (keyof typeof formData)[] = [
  'username',
  'fullname', 
  'email',
  'roles'
]

  const inputClass =
    'border rounded-lg p-3 w-full text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500'
  const cardClass =
    'p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-4'

  /* ------------------ chargement données ------------------ */
  useEffect(() => {
    if (id) {
      fetchUser(id)
      fetchFormationsShort()
      fetchRoles()
    }
  }, [id])

  /* ------------------ remplissage des champs ------------------ */
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || '',
        email: user.email || '',
        username: user.username || '',  
        fullname: user.fullname || '',
        status: user.status || 'active',
        roles: user.roles || [],
        formationsShort: user.formations || [],
      })
    }
  }, [user])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  /* ------------------ toggles ------------------ */
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

  const toggleFormation = (formation: { id: string; title: string }) =>
    setFormData(prev => {
      const exists = prev.formationsShort.some(f => f.id === formation.id)
      return {
        ...prev,
        formations: exists
          ? prev.formationsShort.filter(f => f.id !== formation.id)
          : [...prev.formationsShort, formation],
      }
    })
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
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
          Modifier l’utilisateur
        </h1>

        <form onSubmit={handleSubmit} className="mt-12 space-y-10">
          {/* --- Infos principales --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {[
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'username', label: "Nom d'utilisateur", type: 'text' },
    { name: 'fullname', label: 'Nom complet', type: 'text' },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      options: ['active', 'inactive', 'banned'],
    },
  ].map(field => (
    <div key={field.name} className="flex flex-col gap-2">
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
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
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


          {/* --- Rôles --- */}
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

          {/* --- Formations --- */}
          <div className={cardClass}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Formations</h3>
            <div className="flex flex-wrap gap-3">
              {allFormations.map(formation => (
                <button
                  type="button"
                  key={formation.id}
                  onClick={() => toggleFormation(formation)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors
                    ${
                      formData.formationsShort.some(f => f.id === formation.id)
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
  Enregistrer les modifications
</button>
          </div>
        </form>
      </div>
    </section>
  )
}