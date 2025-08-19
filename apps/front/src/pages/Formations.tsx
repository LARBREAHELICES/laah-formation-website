'use client'
import { useEffect } from 'react'
import { useFormationStore } from '@/stores/useFormation'

export default function AllFormations() {
  const { formations, loading, error, fetchFormations } = useFormationStore()

  useEffect(() => { fetchFormations() }, [fetchFormations])

  if (loading) return <p className="text-center py-10">Chargement…</p>
  if (error)   return <p className="text-center text-red-500 py-10">{error}</p>


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

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
          Our training programmes
        </h2>
        <h4 className="text-xl py-8 tracking-tight text-gray-900 dark:text-gray-300 text-center max-w-3xl mx-auto">
          Choose from our comprehensive range of courses designed to meet the demands of today's job market
        </h4>

        <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
          {formations.map((f) => (
            <article
              key={f.id}
              className="group relative flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm dark:shadow-none transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{f.title}</h3>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  {f.description || f.objectives}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  €{f.total_amount}
                </p>
                <div className="flex items-center gap-1 text-sm">
                  {f.rate}
                  <span className="ml-1 text-gray-500 dark:text-gray-400">(2.3k)</span>
                </div>
              </div>

              <a
                href={`/formations/${f.id}`}
                className="mt-6 block w-full rounded-lg bg-indigo-600 dark:bg-indigo-500 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                Learn more
              </a>
            </article>
          ))}
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