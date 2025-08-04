export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white">Apex Training</h3>
            <p className="mt-2 text-sm">
              Empowering professionals with cutting-edge skills for tomorrow's challenges. Join thousands who've transformed their careers with us.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/testimonials" className="hover:text-white">Testimonials</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Programs</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="/courses/web-development" className="hover:text-white">Web Development</a></li>
              <li><a href="/courses/data-science" className="hover:text-white">Data Science</a></li>
              <li><a href="/courses/ux-ui-design" className="hover:text-white">UX/UI Design</a></li>
              <li><a href="/courses/cybersecurity" className="hover:text-white">Cybersecurity</a></li>
              <li><a href="/courses/digital-marketing" className="hover:text-white">Digital Marketing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Support</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="/help" className="hover:text-white">Help Center</a></li>
              <li><a href="/student-portal" className="hover:text-white">Student Portal</a></li>
              <li><a href="/career-services" className="hover:text-white">Career Services</a></li>
              <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm">
          <p>
            © 2023 Apex Training. All rights reserved. | Designed with ❤️ for learners worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}