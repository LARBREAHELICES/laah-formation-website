import { Link } from '@tanstack/react-router'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 relative z-10">
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
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/testimonials" className="hover:text-white">Testimonials</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Programs</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/courses/web-development" className="hover:text-white">Web Development</Link></li>
              <li><Link to="/courses/data-science" className="hover:text-white">Data Science</Link></li>
              <li><Link to="/courses/ux-ui-design" className="hover:text-white">UX/UI Design</Link></li>
              <li><Link to="/courses/cybersecurity" className="hover:text-white">Cybersecurity</Link></li>
              <li><Link to="/courses/digital-marketing" className="hover:text-white">Digital Marketing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Support</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link to="/student-portal" className="hover:text-white">Student Portal</Link></li>
              <li><Link to="/career-services" className="hover:text-white">Career Services</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
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
