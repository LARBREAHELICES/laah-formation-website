'use client'
import { useState } from 'react'
import { useFormationStore } from '@/stores/useFormation'
import { useNavigate } from '@tanstack/react-router'

export default function NewFormationPage() {
  const navigate = useNavigate()
  const { addFormation } = useFormationStore()

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    slug: '',
    description: '',
    objectives: '',
    prerequisites: '',
    duration_hours: 0,
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
    classroom_student_counts: 0,
    rate: '',
    tags: [] as string[],
    sessions: [] as {
      id: string
      start_date: string
      end_date: string
      location: string
      max_seats: number
      price: string
    }[],
    modules: [] as {
      id: string
      title: string
      duration_hours: number
      description: string
      order_index: number
    }[],
    attachments: [] as string[],
    users: [] as string[],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleNestedChange = <T extends keyof typeof formData>(
    field: T,
    index: number,
    key: keyof (typeof formData)[T][0],
    value: string | number
  ) => {
    setFormData(prev => {
      const updatedArray = [...(prev[field] as any[])]
      updatedArray[index] = { ...updatedArray[index], [key]: value }
      return { ...prev, [field]: updatedArray }
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

  const addNestedItem = <T extends keyof typeof formData>(field: T, emptyItem: any) => {
    setFormData(prev => ({ ...prev, [field]: [...(prev[field] as any[]), emptyItem] }))
  }

  const removeNestedItem = <T extends keyof typeof formData>(field: T, index: number) => {
    setFormData(prev => {
      const updatedArray = [...(prev[field] as any[])]
      updatedArray.splice(index, 1)
      return { ...prev, [field]: updatedArray }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      ...formData,
      duration_hours: Number(formData.duration_hours),
      classroom_student_counts: Number(formData.classroom_student_counts),
      total_amount: formData.total_amount ? parseFloat(formData.total_amount) : null,
      qualiopi_certificate_date: formData.qualiopi_certificate_date ? new Date(formData.qualiopi_certificate_date) : null,
      order_date: formData.order_date ? new Date(formData.order_date) : null,
      sessions: formData.sessions.map(s => ({
        ...s,
        max_seats: Number(s.max_seats)
      })),
      modules: formData.modules.map(m => ({
        ...m,
        duration_hours: Number(m.duration_hours),
        order_index: Number(m.order_index)
      }))
    }

    addFormation(payload)
    navigate({ to: 'admin/dashboard/formations' })
  }

  return (
    <section className="relative isolate bg-white dark:bg-gray-900 overflow-hidden py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white text-center">
          Nouvelle Formation
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 space-y-10 border border-gray-200 dark:border-gray-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'id', placeholder: 'ID' },
              { name: 'title', placeholder: 'Titre' },
              { name: 'slug', placeholder: 'Slug' },
              { name: 'duration_hours', placeholder: 'Durée (heures)', type: 'number' },
              { name: 'qualiopi_certificate_number', placeholder: 'N° Certificat Qualiopi' },
              { name: 'qualiopi_certificate_date', placeholder: 'Date Qualiopi', type: 'date' },
              { name: 'prefecture_registration_number', placeholder: 'N° Enregistrement Préfecture' },
              { name: 'qualiopi_scope', placeholder: 'Portée Qualiopi' },
              { name: 'status', placeholder: 'Statut', type: 'select', options: ['draft', 'published', 'archived'] },
              { name: 'order_number', placeholder: 'N° de commande' },
              { name: 'order_date', placeholder: 'Date commande', type: 'date' },
              { name: 'total_amount', placeholder: 'Tarif total (€)', type: 'number', step: '0.01' },
              { name: 'classroom_student_counts', placeholder: 'Nombre étudiants', type: 'number' },
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
                  step={field.step}
                  className="border rounded-lg p-2 w-full text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
          ].map((field, idx) => (
            <textarea
              key={idx}
              name={field.name}
              placeholder={field.placeholder}
              value={(formData as any)[field.name]}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full text-sm h-28 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          ))}


          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">Tags</h3>
            {formData.tags.map((tag, idx) => (
              <div key={idx} className="flex gap-2 mt-2">
                <input
                  value={tag}
                  onChange={(e) => handleArrayChange('tags', idx, e.target.value)}
                  className="border rounded-lg p-2 w-full text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder={`Tag ${idx + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('tags', idx)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 rounded-lg text-sm"
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('tags')}
              className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded-lg text-sm"
            >
              + Ajouter tag
            </button>
          </div>


          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">Sessions</h3>
            {formData.sessions.map((session, idx) => (
              <div key={idx} className="border p-4 rounded-lg mt-4 bg-gray-50 dark:bg-gray-800">
                {[
                  { key: 'id', label: 'ID', type: 'text' },
                  { key: 'start_date', label: 'Date début', type: 'datetime-local' },
                  { key: 'end_date', label: 'Date fin', type: 'datetime-local' },
                  { key: 'location', label: 'Lieu', type: 'text' },
                  { key: 'max_seats', label: 'Places max', type: 'number' },
                  { key: 'price', label: 'Prix (€)', type: 'number', step: '0.01' }
                ].map((field, i) => (
                  <input
                    key={i}
                    type={field.type}
                    step={field.step}
                    placeholder={field.label}
                    value={(session as any)[field.key]}
                    onChange={(e) => handleNestedChange('sessions', idx, field.key as any, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                    className="border rounded-lg p-2 w-full text-sm mt-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => removeNestedItem('sessions', idx)}
                  className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm"
                >
                  Supprimer session
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addNestedItem('sessions', { id: '', start_date: '', end_date: '', location: '', max_seats: 0, price: '' })}
              className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded-lg text-sm"
            >
              + Ajouter session
            </button>
          </div>


          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">Modules</h3>
            {formData.modules.map((module, idx) => (
              <div key={idx} className="border p-4 rounded-lg mt-4 bg-gray-50 dark:bg-gray-800">
                {[
                  { key: 'id', label: 'ID', type: 'text' },
                  { key: 'title', label: 'Titre', type: 'text' },
                  { key: 'duration_hours', label: 'Durée (heures)', type: 'number' },
                  { key: 'description', label: 'Description', type: 'text' },
                  { key: 'order_index', label: 'Index d\'ordre', type: 'number' }
                ].map((field, i) => (
                  <input
                    key={i}
                    type={field.type}
                    placeholder={field.label}
                    value={(module as any)[field.key]}
                    onChange={(e) => handleNestedChange('modules', idx, field.key as any, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                    className="border rounded-lg p-2 w-full text-sm mt-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => removeNestedItem('modules', idx)}
                  className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm"
                >
                  Supprimer module
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addNestedItem('modules', { id: '', title: '', duration_hours: 0, description: '', order_index: 0 })}
              className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded-lg text-sm"
            >
              + Ajouter module
            </button>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
            >
              Enregistrer la formation
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
