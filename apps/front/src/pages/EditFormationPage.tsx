'use client'

import { useState, useEffect } from 'react'
import { useFormationStore } from '@/stores/useFormation'
import { useTagStore } from '@/stores/useTag'
import { useModuleStore } from '@/stores/useModule'
import { useNavigate, useParams } from '@tanstack/react-router'

export default function EditFormationPage() {
  const navigate = useNavigate()
  const { id } = useParams({ from: '/_authenticated/crud/formations/$id/edit' })

 
  const { formations, updateFormation } = useFormationStore()
  const { tags: allTags, fetchTags } = useTagStore()
  const { modules: allModules, fetchModules } = useModuleStore()

  const existingFormation = formations.find(f => f.id === id)
  const [formData, setFormData] = useState(() => existingFormation || null)


  useEffect(() => {
    fetchTags()
    fetchModules()
  }, [fetchTags, fetchModules])

useEffect(() => {
  if (existingFormation && allTags.length > 0 && allModules.length > 0) {
    setFormData({
      ...existingFormation,
      tags: existingFormation.tags?.map((t: any) => t.id) || [],
      modules: existingFormation.modules?.map((m: any) => m.id) || [],
    })
  }
}, [existingFormation, allTags, allModules])


  useEffect(() => {
    if (!existingFormation && allTags.length > 0 && allModules.length > 0) {
      navigate({ to: '/crud/formations' })
    }
  }, [existingFormation, navigate, allTags, allModules])

  if (!formData || allTags.length === 0 || allModules.length === 0) {
    return (
      <section className="relative isolate bg-white dark:bg-gray-900 overflow-hidden py-16 sm:py-24">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </section>
    )
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => (prev ? { ...prev, [name]: value } : null))
  }

  const handleArrayChange = (field: 'tags' | 'modules', value: string) => {
    setFormData(prev => {
      if (!prev) return null
      const arr = prev[field] as string[]
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter(v => v !== value)
          : [...arr, value],
      }
    })
  }

  const handleNestedChange = (
    index: number,
    key: keyof (typeof formData)['sessions'][0],
    value: string | number
  ) => {
    setFormData(prev => {
      if (!prev) return null
      const updated = [...prev.sessions]
      updated[index] = { ...updated[index], [key]: value }
      return { ...prev, sessions: updated }
    })
  }

  const addSession = () =>
    setFormData(prev =>
      prev
        ? {
            ...prev,
            sessions: [
              ...prev.sessions,
              { start_date: '', end_date: '', location: '', max_seats: 0, price: '' },
            ],
          }
        : null
    )

  const removeSession = (index: number) =>
    setFormData(prev =>
      prev ? { ...prev, sessions: prev.sessions.filter((_, i) => i !== index) } : null
    )

  const handleSubmit = (e: React.FormFormEvent) => {
    e.preventDefault()
    if (!formData) return
    updateFormation(formData)
    navigate({ to: '/crud/formations' })
  }

  
  const inputClass =
    'border rounded-lg p-3 w-full text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500'
  const cardClass =
    'p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-4'

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
          Modifier la Formation
        </h1>

        <form onSubmit={handleSubmit} className="mt-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'title', placeholder: 'Titre', type: 'text' },
              { name: 'slug', placeholder: 'Slug', type: 'text' },
              { name: 'duration_hours', placeholder: 'Durée (heures)', type: 'number' },
              { name: 'classroom_student_counts', placeholder: 'Nombre d\'étudiants', type: 'number' },
              { name: 'total_amount', placeholder: 'Tarif (€)', type: 'number', step: 0.01 },
              {
                name: 'status',
                placeholder: 'Statut',
                type: 'select',
                options: ['draft', 'published', 'archived'],
              },
              {
                name: 'qualiopi_scope',
                placeholder: 'Portée Qualiopi',
                type: 'select',
                options: [
                  'actions de formation',
                  'bilans de compétences',
                  'actions de formation par apprentissage',
                ],
              },
              { name: 'qualiopi_certificate_number', placeholder: 'N° Certificat Qualiopi', type: 'text' },
              { name: 'qualiopi_certificate_date', placeholder: 'Date Certificat', type: 'date' },
              { name: 'prefecture_registration_number', placeholder: 'N° Enregistrement Préfecture', type: 'text' },
              { name: 'order_number', placeholder: 'N° de commande', type: 'text' },
              { name: 'order_date', placeholder: 'Date commande', type: 'date' },
            ].map(field =>
              field.type === 'select' ? (
                <select key={field.name} name={field.name} value={(formData as any)[field.name]} onChange={handleChange} className={inputClass}>
                  {field.options?.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  key={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={(formData as any)[field.name] || ''}
                  onChange={handleChange}
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
            { name: 'evaluation_methods', placeholder: "Méthodes d'évaluation" },
          ].map(field => (
            <textarea key={field.name} name={field.name} placeholder={field.placeholder} value={(formData as any)[field.name] || ''} onChange={handleChange} rows={4} className={inputClass} />
          ))}

          <div className={cardClass}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => {
                const isSelected = formData.tags?.includes(tag.id)
                return (
                  <button
                    type="button"
                    key={tag.id}
                    onClick={() => handleArrayChange('tags', tag.id)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors
                      ${isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600'
                      }`}
                  >
                    {tag.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div className={cardClass}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Modules</h3>
            <div className="flex flex-wrap gap-2">
              {allModules.map(mod => {
                const isSelected = formData.modules?.includes(mod.id)
                return (
                  <button
                    type="button"
                    key={mod.id}
                    onClick={() => handleArrayChange('modules', mod.id)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors
                      ${isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600'
                      }`}
                  >
                    {mod.title}
                  </button>
                )
              })}
            </div>
          </div>


          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Sessions</h3>
            {formData.sessions?.map((session, idx) => (
              <div key={idx} className={cardClass}>
                <input
                  name="start_date"
                  type="datetime-local"
                  value={session.start_date}
                  onChange={e => handleNestedChange(idx, 'start_date', e.target.value)}
                  className={inputClass}
                />
                <input
                  name="end_date"
                  type="datetime-local"
                  value={session.end_date}
                  onChange={e => handleNestedChange(idx, 'end_date', e.target.value)}
                  className={inputClass}
                />
                <input
                  name="location"
                  placeholder="Lieu"
                  value={session.location}
                  onChange={e => handleNestedChange(idx, 'location', e.target.value)}
                  className={inputClass}
                />
                <input
                  name="max_seats"
                  type="number"
                  placeholder="Places max"
                  value={session.max_seats}
                  onChange={e => handleNestedChange(idx, 'max_seats', Number(e.target.value))}
                  className={inputClass}
                />
                <input
                  name="price"
                  type="number"
                  placeholder="Prix (€)"
                  value={session.price}
                  onChange={e => handleNestedChange(idx, 'price', e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => removeSession(idx)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Supprimer
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSession}
              className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              + Ajouter une session
            </button>
          </div>

          {/* ---------- bouton final ---------- */}
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