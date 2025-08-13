'use client'

import { useState, useEffect } from 'react'
import { useFormationStore } from '@/stores/useFormation'
import { useNavigate, useParams } from '@tanstack/react-router'

export default function EditFormationPage() {
  const navigate = useNavigate()
  const { id } = useParams({ from: '/_authenticated/crud/formations/$id/edit' })
  const { formations, updateFormation } = useFormationStore()

  const existingFormation = formations.find(f => f.id === id)
  const [formData, setFormData] = useState(existingFormation || null)

  useEffect(() => {
    if (!existingFormation) {
      navigate({ to: '/admin/dashboard/formations' })
    }
  }, [existingFormation, navigate])

  if (!formData) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => prev ? { ...prev, [name]: Number(value) } : null)
  }

  const handleNestedChange = <T extends keyof typeof formData>(
    field: T,
    index: number,
    key: keyof (typeof formData)[T][0],
    value: string | number
  ) => {
    setFormData(prev => {
      if (!prev) return null
      const updatedArray = [...(prev[field] as any[])]
      updatedArray[index] = { ...updatedArray[index], [key]: value }
      return { ...prev, [field]: updatedArray }
    })
  }

  const addNestedItem = <T extends keyof typeof formData>(field: T, template: any) => {
    setFormData(prev => prev ? { ...prev, [field]: [...(prev[field] as any[]), template] } : null)
  }

  const removeNestedItem = <T extends keyof typeof formData>(field: T, index: number) => {
    setFormData(prev => {
      if (!prev) return null
      const updatedArray = [...(prev[field] as any[])]
      updatedArray.splice(index, 1)
      return { ...prev, [field]: updatedArray }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return
    updateFormation(formData)
    navigate({ to: '/admin/dashboard/formations' })
  }

  const inputClass = "border rounded-lg p-3 w-full text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
  const cardClass = "p-4 border rounded-2xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-all duration-300 hover:shadow-xl space-y-4"

  return (
    <section className="relative isolate bg-white dark:bg-gray-900 overflow-hidden py-16 sm:py-24">
      {/* Top blurred blob */}
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
          Modifier la Formation
        </h1>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Mettez à jour les informations de votre formation.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl p-8 space-y-6 transition-all duration-300 hover:shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'title', placeholder: 'Titre', type: 'text' },
              { name: 'slug', placeholder: 'Slug', type: 'text' },
              { name: 'duration_hours', placeholder: 'Durée (heures)', type: 'number' },
              { name: 'classroom_student_counts', placeholder: 'Nombre d’étudiants', type: 'number' },
              { name: 'total_amount', placeholder: 'Tarif (€)', type: 'number', step: 0.01 },
              { name: 'status', placeholder: 'Statut', type: 'select', options: ['draft', 'published', 'archived'] },
              { name: 'qualiopi_scope', placeholder: 'Portée Qualiopi', type: 'select', options: ['actions de formation', 'bilans de compétences', 'actions de formation par apprentissage'] },
              { name: 'qualiopi_certificate_number', placeholder: 'N° Certificat Qualiopi', type: 'text' },
              { name: 'qualiopi_certificate_date', placeholder: 'Date Certificat', type: 'date' },
              { name: 'prefecture_registration_number', placeholder: 'N° Enregistrement Préfectoral', type: 'text' },
              { name: 'order_number', placeholder: 'N° de commande', type: 'text' },
              { name: 'order_date', placeholder: 'Date commande', type: 'date' }
            ].map(field =>
              field.type === 'select' ? (
                <select
                  key={field.name}
                  name={field.name}
                  value={(formData as any)[field.name] || ''}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input
                  key={field.name}
                  name={field.name}
                  type={field.type || 'text'}
                  placeholder={field.placeholder}
                  value={(formData as any)[field.name] || ''}
                  onChange={field.type === 'number' ? (e) => handleNumberChange(e) : handleChange}
                  step={field.step}
                  className={inputClass}
                />
              )
            )}
          </div>

          {[
            { name: 'description', placeholder: 'Description' },
            { name: 'objectives', placeholder: 'Objectifs' },
            { name: 'prerequisites', placeholder: 'Prérequis' },
            { name: 'pedagogy_methods', placeholder: 'Méthodes pédagogiques' },
            { name: 'evaluation_methods', placeholder: 'Méthodes d\'évaluation' }
          ].map(field => (
            <textarea
              key={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={(formData as any)[field.name] || ''}
              onChange={handleChange}
              rows={4}
              className={inputClass}
            />
          ))}

          {/* Tags */}
          <div className={cardClass}>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tags</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ajouter un tag"
                value={(formData as any).tags?.join(', ') || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) } : null)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Modules */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Modules</h3>
            {formData.modules.map((module: any, idx: number) => (
              <div key={idx} className={cardClass}>
                {['title', 'duration_hours', 'description', 'order_index'].map(key => (
                  <input
                    key={key}
                    type={key === 'duration_hours' || key === 'order_index' ? 'number' : 'text'}
                    placeholder={key}
                    value={module[key] || ''}
                    onChange={(e) => handleNestedChange('modules', idx, key, key === 'duration_hours' || key === 'order_index' ? Number(e.target.value) : e.target.value)}
                    className={inputClass}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => removeNestedItem('modules', idx)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Supprimer
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addNestedItem('modules', { title: '', duration_hours: 0, description: '', order_index: 0 })}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              + Ajouter un module
            </button>
          </div>

          {/* Sessions */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Sessions</h3>
            {formData.sessions.map((session: any, idx: number) => (
              <div key={idx} className={cardClass}>
                {['start_date', 'end_date', 'location', 'max_seats', 'price'].map(key => (
                  <input
                    key={key}
                    type={['start_date', 'end_date'].includes(key) ? 'datetime-local' : key === 'max_seats' ? 'number' : 'text'}
                    placeholder={key}
                    value={session[key] || ''}
                    onChange={(e) => handleNestedChange('sessions', idx, key, ['start_date', 'end_date'].includes(key) ? e.target.value : key === 'max_seats' ? Number(e.target.value) : e.target.value)}
                    className={inputClass}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => removeNestedItem('sessions', idx)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Supprimer
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addNestedItem('sessions', { start_date: '', end_date: '', location: '', max_seats: 0, price: '' })}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              + Ajouter une session
            </button>
          </div>

          <div className="text-center mt-6">
            <button
              type="submit"
              className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity"
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
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2
            bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 dark:opacity-10
            sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </section>
  )
}