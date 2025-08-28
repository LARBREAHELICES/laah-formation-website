// src/pages/FormationSessionRegisterPage.tsx
'use client'

import { useParams } from '@tanstack/react-router'
import { useFormationStore } from '@/stores/useFormation'
import { useInscriptionStore } from '@/stores/useInscription'
import { useEffect, useState } from 'react'

export default function FormationSessionRegisterPage() {
  const { id, sessionId } = useParams({ from: '/formations/$id/sessions/$sessionId/register' })
  const { formation, fetchFormation } = useFormationStore()
  const { submitInscription, isSubmitting, error, response } = useInscriptionStore()

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    countryCode: '+33',
    phoneNumber: '',
    message: '',
  })

  useEffect(() => {
    fetchFormation(id)
  }, [id, fetchFormation])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = { formationId: id, sessionId, ...formData }
  console.log('📦 Payload envoyé :', payload)

  await submitInscription(payload)
  
    if (!error) {
      alert('Inscription envoyée !')
    }
  }

  const session = formation?.sessions?.find(s => s.id === sessionId)

  if (!session) return <p className="text-center py-10">Session introuvable.</p>

  return (
    <section className="relative isolate bg-white dark:bg-gray-900 overflow-hidden py-16 sm:py-24">
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

      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white text-center">
          Inscription – {formation?.title}
        </h1>

        <div className="mb-8 text-center text-gray-700 dark:text-gray-300 space-y-1">
          <p><strong>📍 Lieu :</strong> {session.location}</p>
          <p>
            <strong>🗓️ Dates :</strong>{' '}
            {new Date(session.start_date).toLocaleDateString()} →{' '}
            {new Date(session.end_date).toLocaleDateString()}
          </p>
          <p><strong>💰 Prix :</strong> {session.price} €</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="firstname"
              type="text"
              placeholder="Prénom"
              value={formData.firstname}
              onChange={handleChange}
              required
              className="border rounded-lg p-3 w-full text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="lastname"
              type="text"
              placeholder="Nom"
              value={formData.lastname}
              onChange={handleChange}
              required
              className="border rounded-lg p-3 w-full text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border rounded-lg p-3 w-full text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex border rounded-lg dark:border-gray-700 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="bg-gray-50 dark:bg-gray-900 text-sm px-3 py-2 border-r dark:border-gray-700 focus:outline-none dark:text-white"
              >
                <option value="+33">🇫🇷 +33</option>
                <option value="+32">🇧🇪 +32</option>
                <option value="+41">🇨🇭 +41</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
              </select>
              <input
                name="phoneNumber"
                type="tel"
                placeholder="Numéro de téléphone"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="flex-1 p-3 text-sm dark:bg-gray-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <textarea
            name="message"
            placeholder="Message ou commentaires"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="border rounded-lg p-3 w-full text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
          ></textarea>
          

          <div className="text-center space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Envoi…' : 'Envoyer l’inscription'}
            </button>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {response && <p className="text-green-600 text-sm">Inscription réussie !</p>}
          </div>
        </form>
      </div>

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