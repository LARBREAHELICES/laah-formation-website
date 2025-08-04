
'use client'

export default function ContactSection() {
  return (
    <section id="contact" className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Titre centré */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Get In Touch
          </h2>
        </div>

        {/* Contenu en grille */}
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Gauche : Let’s start a conversation */}
          <div className="flex flex-col justify-center">
            <h3 className="text-4xl font-bold text-gray-900">
              Let’s Start a Conversation
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Ready to take the next step in your career? We’re here to answer
              your questions and help you choose the right program for your goals.
            </p>

            {/* Infos de contact */}
            <div className="mt-8 space-y-6 text-gray-700">
              {[
                { icon: 'fa-map-marker-alt', label: 'Visit Us', value: '123 Tech Avenue, Innovation District\nSan Francisco, CA 94105' },
                { icon: 'fa-phone', label: 'Call Us', value: '+1 (555) 123-4567' },
                { icon: 'fa-envelope', label: 'Email Us', value: 'hello@apextraining.com' },
                { icon: 'fa-clock', label: 'Office Hours', value: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <i className={`fas ${icon} mt-1 text-indigo-600`} />
                  <div>
                    <h4 className="font-semibold text-gray-900">{label}</h4>
                    <p className="whitespace-pre-line">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          

<form className="space-y-5">
  <div>
    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
      Full Name
    </label>
    <input
      type="text"
      id="name"
      placeholder="John Doe"
      className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      required
    />
  </div>


  <div>
    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
      Email Address
    </label>
    <input
      type="email"
      id="email"
      placeholder="john@example.com"
      className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      required
    />
  </div>

 
  <div>
    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
      Subject
    </label>
    <input
      type="text"
      id="subject"
      placeholder="Course Inquiry"
      className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      required
    />
  </div>

 
  <div>
    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
      Message
    </label>
    <textarea
      id="message"
      rows={4}
      placeholder="Tell us about your learning goals..."
      className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      required
    />
  </div>

  <button
    type="submit"
    className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
  >
    <i className="fas fa-paper-plane" />
    Send Message
  </button>
</form>

</div>

</div>

</section>
  ) }
