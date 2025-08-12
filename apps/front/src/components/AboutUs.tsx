export default function AboutSection() {
  return (
    <section className="relative isolate bg-white dark:bg-gray-900 overflow-hidden">

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

      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            About Us
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Empowering Professionals Through Education
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1470&q=80"
            alt="Team collaboration"
            className="w-full rounded-2xl object-cover shadow-xl dark:shadow-none"
          />

          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Empowering Professionals Through Education
            </p>
            <p className="text-base text-gray-700 dark:text-gray-300">
              Founded in 2015, Apex Training has established itself as a leader in
              professional development education. We partner with industry experts
              and leading companies to create curriculum that is theoretically
              sound and immediately applicable. Our hands-on approach ensures
              every student graduates with a portfolio and the confidence to
              tackle complex challenges.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {[
                { value: '10 000+', label: 'Graduates' },
                { value: '95 %', label: 'Job Placement' },
                { value: '50 +', label: 'Instructors' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex-1 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-md dark:shadow-none border border-gray-100 dark:border-gray-700 p-4 text-center"
                >
                  <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
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