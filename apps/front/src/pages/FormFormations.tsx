'use client'

import { useEffect, useState } from 'react'
import { useFormationStore } from '@/stores/useFormation'
import { useTagStore } from '@/stores/useTag'
import { useModuleStore } from '@/stores/useModule'
import { useNavigate } from '@tanstack/react-router'

export default function NewFormationPage() {
  const navigate = useNavigate()


  const { createFormation } = useFormationStore()
  const { tags: allTags, fetchTags } = useTagStore()
  const { modules: allModules, fetchModules } = useModuleStore()

  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    objectives: '',
    prerequisites: '',
    duration_hours: '',
    pedagogy_methods: '',
    evaluation_methods: '',
    qualiopi_certificate_number: '',
    qualiopi_certificate_date: '',
    prefecture_registration_number: '',
    qualiopi_scope: 'actions de formation',
    status: 'draft',
    order_number: '',
    order_date: '',
    total_amount: '',
    classroom_student_counts: '',
    rate: '',
    tags: [] as string[],
    modules: [] as string[],
    sessions: [] as {
      start_date: string
      end_date: string
      location: string
      max_seats: string
      price: string
    }[],
    attachments: [] as string[],
    users: [] as string[],
  })

  useEffect(() => {
    fetchTags()
    fetchModules()
  }, [fetchTags, fetchModules])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNumericChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData
  ) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleArrayChange = (field: 'tags' | 'modules', value: string) => {
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

  const handleNestedChange = (
    index: number,
    key: keyof (typeof formData)['sessions'][0],
    value: string
  ) => {
    setFormData(prev => {
      const updated = [...prev.sessions]
      updated[index] = { ...updated[index], [key]: value }
      return { ...prev, sessions: updated }
    })
  }

  const handleNestedNumericChange = (
    index: number,
    key: 'max_seats' | 'price',
    value: string
  ) => {
    if (/^\d*\.?\d*$/.test(value)) {
      handleNestedChange(index, key, value)
    }
  }

  const addSession = () =>
    setFormData(prev => ({
      ...prev,
      sessions: [
        ...prev.sessions,
        { start_date: '', end_date: '', location: '', max_seats: '', price: '' },
      ],
    }))

  const removeSession = (index: number) =>
    setFormData(prev => ({
      ...prev,
      sessions: prev.sessions.filter((_, i) => i !== index),
    }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
  ...formData,
  duration_hours: formData.duration_hours ? Number(formData.duration_hours) : 0,
  classroom_student_counts: formData.classroom_student_counts ? Number(formData.classroom_student_counts) : 0,
  total_amount: formData.total_amount ? parseFloat(formData.total_amount) : null,
  
 
  rate: formData.rate || null,

  
  qualiopi_certificate_date: formData.qualiopi_certificate_date 
    ? new Date(formData.qualiopi_certificate_date).toISOString()
    : null,

  order_date: formData.order_date
    ? new Date(formData.order_date).toISOString()
    : null,

  sessions: formData.sessions.map(s => ({
    ...s,
    max_seats: s.max_seats ? Number(s.max_seats) : 0,
    price: s.price ? parseFloat(s.price) : 0,
  })),
}

    createFormation(payload)
    navigate({ to: '/crud/formations' })
  }

  const inputClass =
    'border rounded-lg p-3 w-full text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500'
  const cardClass =
    'p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-4'

  return (
    <section className="relative isolate bg-white dark:bg-gray-900 overflow-hidden py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
          Nouvelle Formation
        </h1>

        <form onSubmit={handleSubmit} className="mt-12 space-y-10">
          {/* --- informations principales --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'title', placeholder: 'Titre', type: 'text' },
              { name: 'slug', placeholder: 'Slug', type: 'text' },
              { name: 'duration_hours', placeholder: 'Durée (heures)', type: 'text', numeric: true },
              { name: 'classroom_student_counts', placeholder: 'Nombre d’étudiants', type: 'text', numeric: true },
              { name: 'total_amount', placeholder: 'Tarif (€)', type: 'text', numeric: true, step: 0.01 },
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
                <select
                  key={field.name}
                  name={field.name}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {field.options?.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === 'date' ? (
                <input
                  key={field.name}
                  name={field.name}
                  type={(formData as any)[field.name] ? 'date' : 'text'}
                  placeholder={field.placeholder}
                  value={(formData as any)[field.name] || ''}
                  onFocus={e => (e.target.type = 'date')}
                  onBlur={e => {
                    if (!(formData as any)[field.name]) e.target.type = 'text'
                  }}
                  onChange={handleChange}
                  className={inputClass}
                />
              ) : (
                <input
                  key={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={(formData as any)[field.name]}
                  onChange={
                    field.numeric
                      ? (e) => handleNumericChange(e, field.name as keyof typeof formData)
                      : handleChange
                  }
                  className={inputClass}
                />
              )
            )}
          </div>

          {/* --- champs texte longs --- */}
          {[
            { name: 'description', placeholder: 'Description' },
            { name: 'objectives', placeholder: 'Objectifs' },
            { name: 'prerequisites', placeholder: 'Prérequis' },
            { name: 'pedagogy_methods', placeholder: 'Méthodes pédagogiques' },
            { name: 'evaluation_methods', placeholder: "Méthodes d'évaluation" },
          ].map(field => (
            <textarea
              key={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={(formData as any)[field.name]}
              onChange={handleChange}
              rows={4}
              className={inputClass}
            />
          ))}

          {/* --- tags --- */}
          <div className={cardClass}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => {
                const isSelected = formData.tags.includes(tag.id)
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleArrayChange('tags', tag.id)}
                    className={`px-3 py-1 rounded-full text-sm border 
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

          {/* --- modules --- */}
          <div className={cardClass}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Modules</h3>
            <div className="flex flex-wrap gap-2">
              {allModules.map(mod => {
                const isSelected = formData.modules.includes(mod.id)
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => handleArrayChange('modules', mod.id)}
                    className={`px-3 py-1 rounded-full text-sm border 
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

          {/* --- sessions dynamiques --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Sessions</h3>
            {formData.sessions.map((session, idx) => (
              <div key={idx} className={cardClass}>
                <input
                  type={session.start_date ? 'date' : 'text'}
                  placeholder="Date de début"
                  value={session.start_date || ''}
                  onFocus={e => (e.target.type = 'date')}
                  onBlur={e => {
                    if (!session.start_date) e.target.type = 'text'
                  }}
                  onChange={e => handleNestedChange(idx, 'start_date', e.target.value)}
                  className={inputClass}
                />
                <input
                  type={session.end_date ? 'date' : 'text'}
                  placeholder="Date de fin"
                  value={session.end_date || ''}
                  onFocus={e => (e.target.type = 'date')}
                  onBlur={e => {
                    if (!session.end_date) e.target.type = 'text'
                  }}
                  onChange={e => handleNestedChange(idx, 'end_date', e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Lieu"
                  value={session.location}
                  onChange={e => handleNestedChange(idx, 'location', e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Places max"
                  value={session.max_seats || ''}
                  onChange={e => handleNestedNumericChange(idx, 'max_seats', e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Prix (€)"
                  value={session.price || ''}
                  onChange={e => handleNestedNumericChange(idx, 'price', e.target.value)}
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

          {/* --- bouton final --- */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full md:w-auto rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 py-3 px-6 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity"
            >
              Enregistrer la formation
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}