'use client'

import { useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { useFormationStore } from '@/stores/useFormation'
import { Link } from '@tanstack/react-router'

export default function FormationDetailPage() {
  const { id } = useParams({ from: '/formations/$id/' })
  const { formation, loading, error, fetchFormation } = useFormationStore()

  useEffect(() => {
    fetchFormation(id)
  }, [id, fetchFormation])

  if (loading) return <p className="text-center py-10">Chargement…</p>
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>
  if (!formation) return <p className="text-center py-10">Formation introuvable.</p>

  return (
    <section className="relative isolate bg-white dark:bg-gray-900 overflow-hidden py-16 sm:py-24">
      {/* Background top */}
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

      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid gap-12 lg:grid-cols-[2fr_1fr]">
        {/* Colonne gauche */}
        <div className="space-y-10">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
              {formation.title}
            </h1>
            
            {/* Avis déplacé ici */}
            <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 justify-center lg:justify-start">
               {formation.rate}
              <span className="text-gray-500 dark:text-gray-400"> Avis</span>
            </div>

            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
              {formation.description}
            </p>
          </div>

          {/* Objectifs pédagogiques */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              🎯 Objectifs pédagogiques
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              {formation.objectives?.split('\n').map((obj, idx) => (
                <li key={idx}>{obj}</li>
              ))}
            </ul>
          </div>

          {/* Méthodes, prérequis, évaluation */}
          {[
            ['Pré-requis', formation.prerequisites],
            ['Méthodes pédagogiques', formation.pedagogy_methods],
            ['Méthodes d’évaluation', formation.evaluation_methods],
          ].map(([label, content]) => (
            <div key={label}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{label}</h2>
              <p className="text-gray-700 dark:text-gray-300">{content}</p>
            </div>
          ))}

          {/* Certification */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Certification Qualiopi
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Numéro : {formation.qualiopi_certificate_number}<br />
              Date : {new Date(formation.qualiopi_certificate_date).toLocaleDateString()}
            </p>
          </div>

          {/* Formateurs */}
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
        </div>

        {/* Colonne droite (encart récapitulatif) */}
        <aside className="space-y-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-6 h-fit lg:sticky top-24">
        
        {/* Modules */}
          {formation.modules?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">📚 Modules</h3>
              <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                {formation.modules.map((mod) => (
                  <li key={mod.id} className="flex justify-between">
                    <span>{mod.order_index}. {mod.title}</span>
                    <span>{mod.duration_hours} h</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
            <p><strong>Durée :</strong> {formation.duration_hours} h</p>
            <p><strong>Prix :</strong> {formation.total_amount} €</p>
          </div>

<Link to={`/formations/$id/sessions`} params={{ id }}
className="block w-full text-center bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg">
  Dates, lieux et inscription
</Link>


          {/* Documents déplacés ici */}
          {formation.attachments?.length > 0 && (
            <div className="text-sm">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2">📄 Documents</h2>
              <ul className="list-disc pl-4 text-gray-700 dark:text-gray-300">
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


        </aside>
      </div>

      {/* Background bottom */}
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
