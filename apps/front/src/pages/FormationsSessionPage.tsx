'use client';

import { useEffect } from 'react';
import { useParams } from '@tanstack/react-router';
import { useFormationStore } from '@/stores/useFormation';
import { Link } from '@tanstack/react-router';

export default function FormationSessionsPage() {
  const { id } = useParams({ from: '/formations/$id/sessions/' });
  const { formation, fetchFormation, loading, error } = useFormationStore();

  useEffect(() => {
    fetchFormation(id);
  }, [id, fetchFormation]);

  if (loading) return <p className="text-center py-10">Chargement…</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
  if (!formation) return <p className="text-center py-10">Formation introuvable.</p>;

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

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-10 text-center lg:text-left">
          Sessions disponibles – {formation.title}
        </h1>

        {formation.sessions?.length > 0 ? (
          <ul className="space-y-6">
            {formation.sessions.map((session) => (
              <li
                key={session.id}
                className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-md flex flex-col lg:flex-row justify-between gap-6"
              >
                {/* Infos session */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">📍 Lieu</p>
                    <p>{session.location}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">🗓️ Dates</p>
                    <p>
                      {new Date(session.start_date).toLocaleDateString()} →{' '}
                      {new Date(session.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">👥 Places</p>
                    <p>{session.max_seats}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">💰 Prix</p>
                    <p>{session.price} €</p>
                  </div>
                </div>

                {/* Bouton inscription */}
                <div className="flex justify-end items-start lg:items-center">
                  <Link
                    to ={`/formations/${id}/sessions/${session.id}/register`}
                    className="inline-block whitespace-nowrap px-5 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black font-semibold transition"
                  >
                    S'inscrire
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Aucune session disponible pour cette formation.
          </p>
        )}
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
  );
}
