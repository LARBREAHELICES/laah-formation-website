'use client'
import { Link } from '@tanstack/react-router'

export default function AdminDashboardHome() {
  const sections = [
    {
      id: 'formations',
      title: 'Formations',
      description: 'Gérez les formations disponibles, ajoutez de nouvelles ou modifiez les existantes.',
      link: '/crud/formations/',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 'users',
      title: 'Utilisateurs',
      description: 'Gérez les comptes utilisateurs, leurs inscriptions et leurs permissions.',
      link: '/crud/users',
      color: 'from-pink-500 to-rose-500'
    }
  ]

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

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
          Bienvenue sur le Dashboard
        </h2>
        <h4 className="text-xl py-8 tracking-tight text-gray-900 dark:text-gray-300 text-center max-w-3xl mx-auto">
          Dashboard
        </h4>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {sections.map((s) => (
            <article
              key={s.id}
              className="group relative flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{s.title}</h3>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  {s.description}
                </p>
              </div>

              <Link
                to={s.link}
                className={`mt-6 block w-full rounded-lg bg-gradient-to-r ${s.color} py-2.5 text-center text-sm font-semibold text-white hover:opacity-90`}
              >
                Accéder
              </Link>
            </article>
          ))}
        </div>
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
