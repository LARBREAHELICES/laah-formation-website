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
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 text-center">
          What Our Students Say
        </h2>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote
              key={t.name}
              className="flex flex-col rounded-2xl bg-white p-8 shadow-xl"
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
    </section>
  )
}