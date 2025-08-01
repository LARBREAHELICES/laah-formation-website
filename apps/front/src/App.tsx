'use client'
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
                  {renderStars(4.9)}
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

/* ----- helper ----- */
function renderStars(rating: number) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg
        key={i}
        className={`h-4 w-4 ${i <= rating ? 'text-amber-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    )
  }
  return stars
}