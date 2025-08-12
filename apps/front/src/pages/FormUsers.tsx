'use client'
import { useState } from 'react'
import { useUserStore } from '@/stores/useUser'
import { useNavigate } from '@tanstack/react-router'

export default function NewUserPage() {
  const navigate = useNavigate()
  const { addUser } = useUserStore()

  const [formData, setFormData] = useState({
    id: '',
    email: '',
    username: '',
    fullname: '',
    password: '',
    status: 'active',
    created_at: '',
    updated_at: '',
    roles: [] as string[],
    formations: [] as string[],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (field: keyof typeof formData, index: number, value: string) => {
    setFormData(prev => {
      const newArray = [...(prev[field] as string[])]
      newArray[index] = value
      return { ...prev, [field]: newArray }
    })
  }

  const addArrayItem = (field: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [field]: [...(prev[field] as string[]), ''] }))
  }

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    setFormData(prev => {
      const newArray = [...(prev[field] as string[])]
      newArray.splice(index, 1)
      return { ...prev, [field]: newArray }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      ...formData,
      created_at: formData.created_at ? new Date(formData.created_at) : new Date(),
      updated_at: formData.updated_at ? new Date(formData.updated_at) : new Date(),
    }

    addUser(payload)
    navigate({ to: '/crud/users' })
  }

  return (
    <section className="relative isolate bg-white dark:bg-gray-900 overflow-hidden py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white text-center">
          Nouvel Utilisateur
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 space-y-10 border border-gray-200 dark:border-gray-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'id', placeholder: 'ID' },
              { name: 'email', placeholder: 'Email', type: 'email' },
              { name: 'username', placeholder: 'Nom d’utilisateur' },
              { name: 'fullname', placeholder: 'Nom complet' },
              { name: 'password', placeholder: 'Mot de passe', type: 'password' },
              { name: 'status', placeholder: 'Statut', type: 'select', options: ['active', 'inactive', 'banned'] },
              { name: 'created_at', placeholder: 'Date de création', type: 'datetime-local' },
              { name: 'updated_at', placeholder: 'Date de mise à jour', type: 'datetime-local' },
            ].map((field, idx) =>
              field.type === 'select' ? (
                <select
                  key={idx}
                  name={field.name}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  {field.options!.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  key={idx}
                  name={field.name}
                  type={field.type || 'text'}
                  placeholder={field.placeholder}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              )
            )}
          </div>

          {/* Roles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">Rôles</h3>
            {formData.roles.map((role, idx) => (
              <div key={idx} className="flex gap-2 mt-2">
                <input
                  value={role}
                  onChange={(e) => handleArrayChange('roles', idx, e.target.value)}
                  className="border rounded-lg p-2 w-full text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder={`Rôle ${idx + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('roles', idx)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 rounded-lg text-sm"
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('roles')}
              className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded-lg text-sm"
            >
              + Ajouter rôle
            </button>
          </div>

          {/* Formations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">Formations</h3>
            {formData.formations.map((formation, idx) => (
              <div key={idx} className="flex gap-2 mt-2">
                <input
                  value={formation}
                  onChange={(e) => handleArrayChange('formations', idx, e.target.value)}
                  className="border rounded-lg p-2 w-full text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder={`ID formation ${idx + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('formations', idx)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 rounded-lg text-sm"
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('formations')}
              className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded-lg text-sm"
            >
              + Ajouter formation
            </button>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
            >
              Enregistrer l’utilisateur
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
