export default function ContactSection() {
  return (
    <section id="contact" className="relative isolate bg-white dark:bg-gray-900 py-32 sm:py-40">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 dark:opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Get In Touch
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
            Ready to take the next step in your career? We’re here to help you choose the right path.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <h3 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Let’s Start a Conversation
            </h3>
            <p className="text-lg">
              Whether you have questions or need guidance, our team is ready to support you.
            </p>

            {[
              { icon: 'fa-map-marker-alt', label: 'Visit Us', value: '123 Tech Avenue, Innovation District\nSan Francisco, CA 94105' },
              { icon: 'fa-phone', label: 'Call Us', value: '+1 (555) 123-4567' },
              { icon: 'fa-envelope', label: 'Email Us', value: 'hello@apextraining.com' },
              { icon: 'fa-clock', label: 'Office Hours', value: 'Mon - Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 4:00 PM' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <i className={`fas ${icon} mt-1 text-indigo-600 dark:text-indigo-400`} />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{label}</h4>
                  <p className="whitespace-pre-line">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <form className="space-y-6">
            {[
              { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { id: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
              { id: 'subject', label: 'Subject', type: 'text', placeholder: 'Course Inquiry' },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {label}
                </label>
                <input
                  type={type}
                  id={id}
                  placeholder={placeholder}
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:text-white"
                  required
                />
              </div>
            ))}

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Tell us about your learning goals..."
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              <i className="fas fa-paper-plane" />
              Send Message
            </button>
          </form>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 dark:opacity-10 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </section>
  )
}