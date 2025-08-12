'use client'
import { useState, useEffect } from 'react'
import { useFormationStore } from '@/stores/useFormation'
import { useNavigate, useParams } from '@tanstack/react-router'

export default function EditFormationPage() {
  const navigate = useNavigate()
  const { id } = useParams({ from: '/admin/dashboard/formations/$id' })
  const { formations, updateFormation } = useFormationStore()

  const existingFormation = formations.find(f => f.id === id)

  const [formData, setFormData] = useState(existingFormation || null)

  useEffect(() => {
    if (!existingFormation) {
      navigate({ to: '/admin/dashboard/formations' })
    }
  }, [existingFormation, navigate])

  if (!formData) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (field: keyof typeof formData, index: number, key: string, value: any) => {
    setFormData(prev => {
      const newArray = [...(prev[field] as any[])]
      newArray[index] = { ...newArray[index], [key]: value }
      return { ...prev, [field]: newArray }
    })
  }

  const addArrayItem = (field: keyof typeof formData, template: any) => {
    setFormData(prev => ({ ...prev, [field]: [...(prev[field] as any[]), template] }))
  }

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    setFormData(prev => {
      const newArray = [...(prev[field] as any[])]
      newArray.splice(index, 1)
      return { ...prev, [field]: newArray }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFormation(formData)
    navigate({ to: '/admin/dashboard/formations' })
  }

  return (
    <section className="relative isolate bg-white dark:bg-gray-900 overflow-hidden py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">
          Modifier la Formation
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 space-y-8 border border-gray-200 dark:border-gray-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'id', placeholder: 'ID' },
              { name: 'title', placeholder: 'Titre' },
              { name: 'slug', placeholder: 'Slug' },
              { name: 'duration_hours', placeholder: 'Durée (heures)', type: 'number' },
              { name: 'qualiopi_certificate_number', placeholder: 'N° Certificat Qualiopi' },
              { name: 'qualiopi_certificate_date', placeholder: 'Date Qualiopi', type: 'date' },
              { name: 'prefecture_registration_number', placeholder: 'N° Enregistrement Préfectoral' },
              { name: 'total_amount', placeholder: 'Tarif (€)', type: 'number' }
            ].map((field, idx) => (
              <input
                key={idx}
                name={field.name}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                value={(formData as any)[field.name] || ''}
                onChange={handleChange}
                className="border rounded p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            ))}
          </div>

          {[
            { name: 'description', placeholder: 'Description' },
            { name: 'objectives', placeholder: 'Objectifs' },
            { name: 'prerequisites', placeholder: 'Prérequis' },
            { name: 'pedagogy_methods', placeholder: 'Méthodes pédagogiques' },
            { name: 'evaluation_methods', placeholder: 'Méthodes d\'évaluation' }
          ].map((field, idx) => (
            <textarea
              key={idx}
              name={field.name}
              placeholder={field.placeholder}
              value={(formData as any)[field.name] || ''}
              onChange={handleChange}
              className="border rounded p-2 w-full h-24 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          ))}

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-200">Modules</h3>
            {formData.modules.map((module: any, idx: number) => (
              <div key={idx} className="p-4 border rounded-lg mb-4 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 space-y-2">
                {['id', 'title', 'duration_hours', 'description', 'order_index'].map((key) => (
                  <input
                    key={key}
                    type={key === 'duration_hours' || key === 'order_index' ? 'number' : 'text'}
                    placeholder={key}
                    value={module[key] || ''}
                    onChange={(e) => handleArrayChange('modules', idx, key, e.target.value)}
                    className="border rounded p-2 w-full dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                ))}
                <button type="button" onClick={() => removeArrayItem('modules', idx)} className="bg-red-500 text-white px-3 py-1 rounded">Supprimer</button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('modules', { id: '', title: '', duration_hours: 0, description: '', order_index: 0 })}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded"
            >
              + Ajouter un module
            </button>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-200">Sessions</h3>
            {formData.sessions.map((session: any, idx: number) => (
              <div key={idx} className="p-4 border rounded-lg mb-4 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 space-y-2">
                {['id', 'start_date', 'end_date', 'location', 'max_seats', 'price'].map((key) => (
                  <input
                    key={key}
                    type={['start_date', 'end_date'].includes(key) ? 'datetime-local' : key === 'max_seats' ? 'number' : 'text'}
                    placeholder={key}
                    value={session[key] || ''}
                    onChange={(e) => handleArrayChange('sessions', idx, key, e.target.value)}
                    className="border rounded p-2 w-full dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                ))}
                <button type="button" onClick={() => removeArrayItem('sessions', idx)} className="bg-red-500 text-white px-3 py-1 rounded">Supprimer</button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('sessions', { id: '', start_date: '', end_date: '', location: '', max_seats: 0, price: '' })}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded"
            >
              + Ajouter une session
            </button>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded">
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
