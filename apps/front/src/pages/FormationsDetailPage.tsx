
'use client'
import { useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { useFormationStore } from '@/stores/useFormation'

export default function FormationDetailPage() {
  const { slug } = useParams({ from: '/formations/$slug' })
  const { formation, loading, error, fetchFormation } = useFormationStore()

  useEffect(() => {
    fetchFormation(slug)
  }, [slug, fetchFormation])

  if (loading) return <p className="text-center py-10">Chargement…</p>
  if (error)   return <p className="text-center text-red-500 py-10">{error}</p>
  if (!formation) return <p className="text-center py-10">Formation introuvable.</p>

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <img
          alt={formation.title}
          className="w-full rounded-xl object-cover"
        />
        <h1 className="mt-8 text-5xl font-bold text-gray-900">{formation.title}</h1>
        <p className="mt-4 text-lg text-gray-700">{formation.description}</p>
        <p className="mt-2 text-sm text-gray-500">Durée : {formation.duration_hours} h</p>
        <p className="mt-4 text-3xl font-bold text-indigo-600">€{formation.total_amount}</p>
        <button className="mt-8 rounded-lg bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-500">
          Enroll Now
        </button>
      </div>
    </section>
  )
}