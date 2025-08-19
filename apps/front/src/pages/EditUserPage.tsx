'use client'
import { useEffect, useState } from 'react'
import { useUserStore } from '@/stores/useUser'
import { useFormationStore } from '@/stores/useFormation'
import { useNavigate, useParams } from '@tanstack/react-router'

export default function EditUserPage() {
  const navigate = useNavigate()
  const { id } = useParams({ strict: false })
  const { user, fetchUser, updateUser } = useUserStore()
  const { formations: allFormations, fetchFormations } = useFormationStore()

  /* ------------------ état local ------------------ */
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

  /* ------------------ styles ------------------ */
  const inputClass =
    'border rounded-lg p-3 w-full text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500'
  const cardClass =
    'p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-4'

  /* ------------------ chargement ------------------ */
  useEffect(() => {
    if (id) {
      fetchUser(id)
      fetchFormations()
    }
  }, [id, fetchUser, fetchFormations])

  /* ------------------ remplissage des champs ------------------ */
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || '',
        email: user.email || '',
        username: user.username || '',
        fullname: user.fullname || '',
        password: '', // on ne pré-remplit pas
        status: user.status || 'active',
        roles: user.roles?.map((r: any) => r.name) || [],
        formations: user.formations?.map((f: any) => f.id) || [],
      })
    }
  }, [user])

  /* ------------------ handlers ------------------ */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  /* formations : toggle tags */
  const toggleFormation = (formationId: string) =>
    setFormData(prev => ({
      ...prev,
      formations: prev.formations.includes(formationId)
        ? prev.formations.filter(f => f !== formationId)
        : [...prev.formations, formationId],
    }))

  /* rôles : ajout / suppression */
  const handleRoleChange = (index: number, value: string) => {
    const updated = [...formData.roles]
    updated[index] = value
    setFormData(prev => ({ ...prev, roles: updated }))
  }
  const addRole = () =>
    setFormData(prev => ({ ...prev, roles: [...prev.roles, ''] }))
  const removeRole = (index: number) =>
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.filter((_, i) => i !== index),
    }))

  /* ------------------ submit ------------------ */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      roles: formData.roles.filter(r => r.trim() !== ''),
    }
    updateUser(id!, payload)
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
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
          Modifier l’utilisateur
        </h1>

        <form onSubmit={handleSubmit} className="mt-12 space-y-10">
          {/* --- Informations principales --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'id', placeholder: 'ID', type: 'text' },
              { name: 'email', placeholder: 'Email', type: 'email' },
              { name: 'username', placeholder: "Nom d'utilisateur", type: 'text' },
              { name: 'fullname', placeholder: 'Nom complet', type: 'text' },
              { name: 'password', placeholder: 'Nouveau mot de passe (laisser vide pour garder)', type: 'password' },
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

          {/* --- Rôles dynamiques --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Rôles
            </h3>
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

          {/* --- Formations (tags) --- */}
          <div className={cardClass}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Formations
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {allFormations.map(f => {
                const isSelected = formData.formations.includes(f.id)
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFormation(f.id)}
                    className={`px-3 py-1 rounded-full text-sm border cursor-pointer
                      ${isSelected
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600'
                      }`}
                  >
                    {f.title}
                  </button>
                )
              })}
            </div>
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
    </section>
  )
}