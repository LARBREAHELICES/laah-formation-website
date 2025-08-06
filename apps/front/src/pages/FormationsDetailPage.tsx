'use client'
import { useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { useFormationStore } from '@/stores/useFormation'

export default function FormationDetailPage() {
  const { id } = useParams({ from: '/formations/$id' })
  const { formation, loading, error, fetchFormation } = useFormationStore()

  useEffect(() => {
    fetchFormation(id)
  }, [id, fetchFormation])

  if (loading) return <p className="text-center py-10">Chargement…</p>
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>
  if (!formation) return <p className="text-center py-10">Formation introuvable.</p>

  return (
    <section className="relative isolate bg-white dark:bg-gray-900 overflow-hidden py-16 sm:py-24">
      {/* Top gradient blurred shape */}
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

      <div className="mx-auto max-w-5xl px-6 lg:px-8 space-y-10">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            {formation.title}
          </h1>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            {formation.description}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Durée : {formation.duration_hours} h
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-center">
          {/* <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {formation.total_amount} €
          </div> */}
          <div className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
            {formation.rate}
            <span className="text-gray-500 dark:text-gray-400">(avis)</span>
          </div>
        </div>

        <div className="space-y-6">
          {[
            ['Objectifs', formation.objectives],
            ['Pré-requis', formation.prerequisites],
            ['Méthodes pédagogiques', formation.pedagogy_methods],
            ['Méthodes d’évaluation', formation.evaluation_methods],
          ].map(([label, content]) => (
            <div key={label}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{label}</h2>
              <p className="text-gray-700 dark:text-gray-300">{content}</p>
            </div>
          ))}

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Certification Qualiopi
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Numéro : {formation.qualiopi_certificate_number}<br />
              Date : {new Date(formation.qualiopi_certificate_date).toLocaleDateString()}
            </p>
          </div>

          {formation.modules?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Modules</h2>
              <ul className="grid gap-4 mt-2">
                {formation.modules.map((mod) => (
                  <li key={mod.id} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {mod.order_index}. {mod.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Durée : {mod.duration_hours} h</p>
                    <p className="mt-1 text-gray-700 dark:text-gray-300">{mod.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {formation.sessions?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Sessions</h2>
              <ul className="grid gap-6 mt-4">
                {formation.sessions.map((session) => (
                  <li
                    key={session.id}
                    className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm"
                  >
                    <div className="grid sm:grid-cols-2 gap-4 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900 dark:text-white">📍 Lieu</p>
                        <p>{session.location}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900 dark:text-white">🗓️ Dates</p>
                        <p>
                          {new Date(session.start_date).toLocaleDateString()} →{' '}
                          {new Date(session.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900 dark:text-white">👥 Places</p>
                        <p>{session.max_seats}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900 dark:text-white">💰 Prix</p>
                        <p>{session.price} €</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {formation.trainers?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Formateurs</h2>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                {formation.trainers.map((trainer, index) => (
                  <li key={index}>{trainer.fullname}</li>
                ))}
              </ul>
            </div>
          )}

          {formation.attachments?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Documents</h2>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                {formation.attachments.map((att) => (
                  <li key={att.id}>
                    <a
                      href={att.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 underline"
                    >
                      {att.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="text-center">
          <a
            href="#"
            className="inline-block rounded-lg bg-indigo-600 dark:bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            S'inscrire
          </a>
        </div>
      </div>

      {/* Bottom gradient blurred shape */}
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
