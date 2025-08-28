'use client'

import { useState, useEffect } from 'react'
import { useFormationStore } from '@/stores/useFormation'
import { useTagStore } from '@/stores/useTag'
import { useModuleStore } from '@/stores/useModule'
import { useUserStore } from '@/stores/useUser'
import { useNavigate, useParams } from '@tanstack/react-router'

export default function EditFormationPage() {
  const navigate = useNavigate()
  const { id } = useParams({ strict: false })

  const { formation, fetchFormation, updateFormation } = useFormationStore()
  const { tags: allTags, fetchTags } = useTagStore()
  const { modules: allModules, fetchModules } = useModuleStore()
  const { users: allUsers, fetchUsers } = useUserStore()
  const [attachmentInput, setAttachmentInput] = useState('')

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
    status: 'draft' as 'draft' | 'published' | 'archived',
    order_number: '',
    order_date: '',
    total_amount: '',
    classroom_student_counts: '',
    rate: '',
    tags: [] as string[],
    modules: [] as string[],
    sessions: [] as {
      id?: string
      start_date: string
      end_date: string
      location: string
      max_seats: string
      price: string
    }[],
    attachments: [] as string[],
    trainers: [] as string[],
  })

  const requiredFields: (keyof typeof formData)[] = [
  'title',
  'slug',
  'description',
  'objectives',
  'duration_hours',
  'total_amount',
  'tags',
  'modules',
  'sessions',
  'trainers',
]

const [triedToSubmit, setTriedToSubmit] = useState(false)

const isFormValid = () => {
  return requiredFields.every(field => {
    const value = formData[field]
    if (Array.isArray(value)) return value.length > 0
    return value !== '' && value != null
  })
}

  const inputClass =
    'border rounded-lg p-3 w-full text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500'
  const cardClass =
    'p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-4'

  /* ------------------ chargement données ------------------ */
  useEffect(() => {
    if (id) {
      fetchFormation(id)
      fetchTags()
      fetchModules()
      fetchUsers()
    }
  }, [id, fetchFormation, fetchTags, fetchModules, fetchUsers])

  /* ------------------ remplissage des champs ------------------ */
  useEffect(() => {
    if (formation) {
      setFormData({
        title: formation.title || '',
        slug: formation.slug || '',
        description: formation.description || '',
        objectives: formation.objectives || '',
        prerequisites: formation.prerequisites || '',
        pedagogy_methods: formation.pedagogy_methods || '',
        evaluation_methods: formation.evaluation_methods || '',
        duration_hours: String(formation.duration_hours || ''),
        classroom_student_counts: String(formation.classroom_student_counts || ''),
        total_amount: String(formation.total_amount || ''),
        rate: String(formation.rate || ''),
        status: formation.status || 'draft',
        qualiopi_scope: formation.qualiopi_scope || 'actions de formation',
        qualiopi_certificate_number: formation.qualiopi_certificate_number || '',
        qualiopi_certificate_date: formation.qualiopi_certificate_date?.split('T')[0] || '',
        prefecture_registration_number: formation.prefecture_registration_number || '',
        order_number: formation.order_number || '',
        order_date: formation.order_date?.split('T')[0] || '',
        tags: formation.tags?.map((t: any) => t.id) || [],
        modules: formation.modules?.map((m: any) => m.id) || [],
        trainers: formation.trainers?.map((t: any) => t.id) || [],
        sessions: formation.sessions?.map((s: any) => ({
          id: s.id,
          start_date: s.start_date?.split('T')[0] || '',
          end_date: s.end_date?.split('T')[0] || '',
          location: s.location || '',
          max_seats: String(s.max_seats || ''),
          price: String(s.price || ''),
        })) || [],
        attachments: formation.attachments?.map((a: any) => a.file_url) || [],
      })
    }
  }, [formation])

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

  const handleArrayChange = (field: 'tags' | 'modules' | 'trainers', value: string) => {
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

  const addAttachment = () => {
    const url = attachmentInput.trim()
    if (!url) return
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, url] }))
    setAttachmentInput('')
  }

  const removeAttachment = (index: number) =>
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTriedToSubmit(true)
  if (!isFormValid()) return

    const payload = {
      title: formData.title || undefined,
      slug: formData.slug || undefined,
      description: formData.description || undefined,
      objectives: formData.objectives || undefined,
      prerequisites: formData.prerequisites || undefined,
      pedagogy_methods: formData.pedagogy_methods || undefined,
      evaluation_methods: formData.evaluation_methods || undefined,
      duration_hours: formData.duration_hours ? Number(formData.duration_hours) : 0,
      classroom_student_counts: formData.classroom_student_counts ? Number(formData.classroom_student_counts) : 0,
      total_amount: formData.total_amount ? parseFloat(formData.total_amount) : 0,
      rate: formData.rate ? formData.rate : "",
      status: formData.status || undefined,
      qualiopi_scope: formData.qualiopi_scope || undefined,
      qualiopi_certificate_number: formData.qualiopi_certificate_number || undefined,
      qualiopi_certificate_date: formData.qualiopi_certificate_date || null,
      prefecture_registration_number: formData.prefecture_registration_number || undefined,
      order_number: formData.order_number || undefined,
      order_date: formData.order_date || null,

      tags: formData.tags.map(tagId => {
        const tag = allTags.find(t => t.id === tagId)
        return { id: tagId, name: tag?.name || '' }
      }),
      
      modules: formData.modules.map(moduleId => {
        const module = allModules.find(m => m.id === moduleId)
        return { 
          id: moduleId, 
          title: module?.title || '', 
          description: module?.description || '',
          duration_hours: module?.duration_hours || 0,
          order_index: module?.order_index || 0
        }
      }),
      
      trainers: formData.trainers.map(trainerId => {
        const trainer = allUsers.find(u => u.id === trainerId)
        return { 
          id: trainerId, 
          fullname: trainer?.fullname || '', 
          username :trainer?.username || '',
          email: trainer?.email || '',
          status: trainer?.status || '',
          roles: trainer?.roles || []
        }
      }),
      
      sessions: formData.sessions.map(s => ({
        id: s.id || null,
        start_date: s.start_date ? new Date(s.start_date).toISOString() : '',
        end_date: s.end_date ? new Date(s.end_date).toISOString() : '',
        location: s.location || '',
        max_seats: Number(s.max_seats) || 0,
        price: parseFloat(s.price) || 0,
      })),
      
      attachments: formData.attachments.map(url => ({
        file_url: url,
        label: 'Document',
        file_type: url.split('.').pop() || 'unknown'
      })),
    }

    console.log('Submitting payload:', payload)

    updateFormation({ id, ...payload })
    navigate({ to: '/crud/formations' })
  }

  if (!formation || !allTags.length || !allModules.length || !allUsers.length) {
    return (
      <section className="relative isolate bg-white dark:bg-gray-900 overflow-hidden py-16 sm:py-24">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative isolate bg-white dark:bg-gray-900 overflow-hidden py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
          Modifier la Formation
        </h1>

        <form onSubmit={handleSubmit} className="mt-12 space-y-10">
          {/* --- informations principales --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {[
    { name: 'title', placeholder: 'Titre', type: 'text' },
    { name: 'slug', placeholder: 'Slug', type: 'text' },
    { name: 'duration_hours', placeholder: 'Durée (heures)', type: 'text', numeric: true },
    { name: 'classroom_student_counts', placeholder: "Nombre d'étudiants", type: 'text', numeric: true },
    { name: 'total_amount', placeholder: 'Tarif (€)', type: 'text', numeric: true, step: 0.01 },
    { name: 'rate', placeholder: 'Avis', type: 'text' },
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
  ].map(field => (
    <div key={field.name}>
      <label
        htmlFor={field.name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {field.placeholder}
      </label>

      {field.type === 'select' ? (
        <select
          id={field.name}
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
          id={field.name}
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
          id={field.name}
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
      )}
    </div>
  ))}
</div>

          {/* --- champs texte longs --- */}
<div className="space-y-6">
  {[
    { name: 'description', placeholder: 'Description' },
    { name: 'objectives', placeholder: 'Objectifs' },
    { name: 'prerequisites', placeholder: 'Prérequis' },
    { name: 'pedagogy_methods', placeholder: 'Méthodes pédagogiques' },
    { name: 'evaluation_methods', placeholder: "Méthodes d'évaluation" },
  ].map(field => (
    <div key={field.name}>
      <label
        htmlFor={field.name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {field.placeholder}
      </label>
      <textarea
        id={field.name}
        name={field.name}
        placeholder={field.placeholder}
        value={(formData as any)[field.name]}
        onChange={handleChange}
        rows={4}
        className={inputClass}
      />
    </div>
  ))}
</div>

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

          {/* --- formateurs --- */}
          <div className={cardClass}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Formateurs</h3>
            <div className="flex flex-wrap gap-2">
              {allUsers.filter(user => user.roles?.some(role => role.name === 'teacher')).map(user => {
                const isSelected = formData.trainers.includes(user.id)
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleArrayChange('trainers', user.id)}
                    className={`px-3 py-1 rounded-full text-sm border 
                      ${isSelected 
                        ? 'bg-purple-600 text-white border-purple-600' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600'
                      }`}
                  >
                    {user.fullname}
                  </button>
                )
              })}
            </div>
          </div>

          {/* --- pièces jointes --- */}
          <div className={cardClass}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Pièces jointes
            </h3>

            {/* Ajout */}
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://exemple.com/fichier.pdf "
                value={attachmentInput}
                onChange={e => setAttachmentInput(e.target.value)}
                className={inputClass}
              />
              <button
                type="button"
                onClick={addAttachment}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
              >
                Ajouter
              </button>
            </div>

            {/* Liste */}
            <div className="mt-3 space-y-2">
              {formData.attachments.map((url, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg p-2"
                >
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 dark:text-indigo-400 underline truncate max-w-[75%]"
                  >
                    {url}
                  </a>
                  <button
                    type="button"
                    onClick={() => removeAttachment(idx)}
                    className="text-red-600 hover:text-red-800 text-xs font-semibold"
                  >
                    Retirer
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* --- bouton final --- */}
          {triedToSubmit && !isFormValid() && (
  <p className="text-sm text-red-600 text-center">
    Veuillez remplir tous les champs obligatoires avant d’enregistrer.
  </p>
)}

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