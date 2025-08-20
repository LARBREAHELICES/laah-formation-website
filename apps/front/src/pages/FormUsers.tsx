'use client'
import { useEffect, useState } from 'react'
import { useUserStore } from '@/stores/useUser'
import { useFormationStore } from '@/stores/useFormation'
import { useNavigate } from '@tanstack/react-router'

export default function NewUserPage() {
  const navigate = useNavigate()

  /* ------------------ stores ------------------ */
  const { addUser } = useUserStore()
  const { formations: allFormations, fetchFormations } = useFormationStore()

  /* ------------------ state du formulaire ------------------ */
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    username: '',
    fullname: '',
    password: '',
    status: 'active' as 'active' | 'inactive' | 'banned',
    roles: [] as string[],
    formations: [] as string[],
  })

  /* ------------------ chargement des listes ------------------ */
  useEffect(() => {
    fetchFormations()
  }, [fetchFormations])

  /* ------------------ styles ------------------ */
  const inputClass =
    'border rounded-lg p-3 w-full text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500'
  const cardClass =
    'p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-4'

  /* ------------------ handlers ------------------ */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (field: 'formations', value: string) => {
    setFormData(prev => {
      const arr = prev[field] as string[]
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter(v => v !== value)
          : [...arr, value],
      }
    })
  }

  /* ------------- Gestion des rôles (similaire aux sessions) ------------- */
  const handleRoleChange = (index: number, value: string) => {
    setFormData(prev => {
      const updated = [...prev.roles]
      updated[index] = value
      return { ...prev, roles: updated }
    })
  }

  const addRole = () =>
    setFormData(prev => ({ ...prev, roles: [...prev.roles, ''] }))

  const removeRole = (index: number) =>
    setFormData(prev => ({ ...prev, roles: prev.roles.filter((_, i) => i !== index) }))

  /* ------------------ submit ------------------ */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // nettoyage : on enlève les rôles vides
    const payload = {
      ...formData,
      roles: formData.roles.filter(r => r.trim() !== ''),
    }
    addUser(payload)
    navigate({ to: '/crud/users' })
  }

  return (
    <section className="relative isolate bg-white dark:bg-gray-900 overflow-hidden py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
          Nouvel Utilisateur
        </h1>

        <form onSubmit={handleSubmit} className="mt-12 space-y-10">
          {/* --- Informations principales --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'id', placeholder: 'ID', type: 'text' },
              { name: 'email', placeholder: 'Email', type: 'email' },
              { name: 'username', placeholder: "Nom d'utilisateur", type: 'text' },
              { name: 'fullname', placeholder: 'Nom complet', type: 'text' },
              { name: 'password', placeholder: 'Mot de passe', type: 'password' },
              {
                name: 'status',
                placeholder: 'Statut',
                type: 'select',
                options: ['active', 'inactive'],
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

          {/* --- Rôles dynamiques --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Rôles</h3>
            {formData.roles.map((role, idx) => (
              <div key={idx} className={cardClass}>
                <input
                  value={role}
                  onChange={e => handleRoleChange(idx, e.target.value)}
                  placeholder={`Rôle ${idx + 1}`}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => removeRole(idx)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Supprimer
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRole}
              className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              + Ajouter rôle
            </button>
          </div>

         

          {/* --- Bouton final --- */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full md:w-auto rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 py-3 px-6 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity"
            >
              Enregistrer l’utilisateur
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}