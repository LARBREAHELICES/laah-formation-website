/* 'use client'
import { useEffect } from 'react'
import { useFormationStore } from '@/stores/useFormation'

export default function FeaturedFormations() {
  const { formations, loading, error, fetchFormations } = useFormationStore()

  useEffect(() => { fetchFormations() }, [fetchFormations])
  if (loading) return <p className="text-center py-10">Chargement…</p>
  if (error)   return <p className="text-center text-red-500 py-10">{error}</p>

  const featured = formations.slice(0, 3)

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center">
          Our training programms
        </h2>
        <h4 className="text-xl py-8 tracking-tight text-gray-900 text-center">
          Choose from our comprehensive range of courses designed to meet the demands of today's job market
        </h4>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((f) => (
            <article
              key={f.id}
              className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{f.title}</h3>
                <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                  {f.description || f.objectives}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">
                  €{f.total_amount}
                </p>
                <div className="flex items-center gap-1 text-sm">
                  {f.rate}
                  <span className="ml-1 text-gray-500">(2.3k)</span>
                </div>
              </div>

              <a
                href={`/formations/${f.slug}`}
                className="mt-6 block w-full rounded-lg bg-indigo-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Learn more
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
*/



import { Outlet } from '@tanstack/react-router'

export default function App() {
  return <Outlet />
}