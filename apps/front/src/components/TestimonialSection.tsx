// src/components/TestimonialSection.tsx
'use client'

const testimonials = [
  {
    quote:
      'The instructors at Apex are exceptional. They bring real industry experience to the classroom and provide personalized feedback that helped me build a portfolio that impressed employers.',
    name: 'Michael Chen',
    role: 'UX Designer at InnovateLab',
    avatar: 'https://i.pravatar.cc/64?u=michael',
  },
  {
    quote:
      'The Full-Stack Web Development course completely transformed my career. Within 3 months of completing the program, I landed a job as a junior developer with a 40 % salary increase!',
    name: 'Lisa Rodriguez',
    role: 'Software Engineer at TechCorp',
    avatar: 'https://i.pravatar.cc/64?u=lisa',
  },
  {
    quote:
      'The Data Science program gave me the skills and confidence to transition from marketing to analytics. The career support team was instrumental in helping me navigate this career change.',
    name: 'Sarah Johnson',
    role: 'Data Analyst at GlobalFinance',
    avatar: 'https://i.pravatar.cc/64?u=sarah',
  },
]

export default function TestimonialSection() {
  return (
    <section className="relative isolate bg-white overflow-hidden py-16 sm:py-24">
      {/* Top blob */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 text-center">
          What Our Students Say
        </h2>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote
              key={t.name}
              className="flex flex-col rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl border border-gray-100 p-8"
            >
              <p className="text-lg text-gray-700 italic leading-relaxed">
                “{t.quote}”
              </p>

              <footer className="mt-8 flex items-center gap-5">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-xl font-semibold text-gray-900">{t.name}</p>
                  <p className="text-base text-gray-600">{t.role}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>

      {/* Bottom blob */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
        />
      </div>
    </section>
  )
}