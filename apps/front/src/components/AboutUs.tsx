export default function AboutSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            About Us
          </h2>
        </div>

        {/* Image left / content right */}
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* Image */}
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1470&q=80"
            alt="Team collaboration"
            className="w-full h-auto rounded-2xl object-cover shadow-lg"
          />

          {/* Text + Stats */}
          <div>
            {/* Bold lead text */}
            <p className="text-xl font-bold text-gray-900 mb-4">
                 Empowering Professionals Through Education 
            </p>

            <p className="text-base text-gray-700">
            Founded in 2015, Apex Training has established itself as a leader in
              professional development education.
              We partner with industry experts and leading companies to create
              curriculum that is theoretically sound and immediately applicable.
              Our hands-on approach ensures every student graduates with a
              portfolio and the confidence to tackle complex challenges.
            </p>

            {/* Mini-cards stats */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {[
                { value: '10 000+', label: 'Graduates' },
                { value: '95 %', label: 'Job Placement' },
                { value: '50 +', label: 'Instructors' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex-1 bg-indigo-50 rounded-xl p-4 text-center shadow"
                >
                  <p className="text-3xl font-extrabold text-indigo-600">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-indigo-700 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}