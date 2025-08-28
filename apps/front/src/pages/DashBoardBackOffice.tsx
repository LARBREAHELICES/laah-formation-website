'use client'

const demandes = [
  {
    id: '1',
    prenom: 'Alice',
    nom: 'Martin',
    telephone: '06 12 34 56 78',
    email: 'alice.martin@example.com',
    formation: 'Développement Web',
    session: 'Septembre 2025',
  },
  {
    id: '2',
    prenom: 'Youssef',
    nom: 'Benali',
    telephone: '06 98 76 54 32',
    email: 'youssef.benali@example.com',
    formation: 'Data Analyst',
    session: 'Octobre 2025',
  },
  {
    id: '3',
    prenom: 'Clara',
    nom: 'Dumont',
    telephone: '07 11 22 33 44',
    email: 'clara.dumont@example.com',
    formation: 'UX/UI Design',
    session: 'Novembre 2025',
  },
]

export default function DemandesInscriptionPage() {
  return (
    <section className="bg-white dark:bg-gray-900 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
          Demandes d’inscription
        </h1>

        <div className="mt-12 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {demandes.map((d) => (
            <div
              key={d.id}
              className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                {d.prenom} {d.nom}
              </h2>
              <dl className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <div>
                  <dt className="font-medium">Email :</dt>
                  <dd>{d.email}</dd>
                </div>
                <div>
                  <dt className="font-medium">Téléphone :</dt>
                  <dd>{d.telephone}</dd>
                </div>
                <div>
                  <dt className="font-medium">Formation :</dt>
                  <dd>{d.formation}</dd>
                </div>
                <div>
                  <dt className="font-medium">Session :</dt>
                  <dd>{d.session}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}