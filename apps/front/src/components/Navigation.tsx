'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from '@tanstack/react-router'

const navItems = [
  { label: 'Home', to: '/', name: 'Home' },
  { label: 'Courses', to: '/courses', name: 'Courses' },
  { label: 'About us', to: '/about', name: 'About us' },
  { label: 'Testimonials', to: '/testimonials', name: 'Testimonials' },
  { label: 'Contact', to: '/contact', name: 'Contact' },
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
    <header className="absolute inset-x-0 top-0 z-50 bg-white">
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex items-center gap-3">
      <Link to="/" className="flex items-center gap-2">
        <img
          className="h-8 w-auto"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          alt="Logo MaFormation"
        />
        <span className="text-xl font-bold text-gray-900">LAAH</span>
      </Link>
    </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="size-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navItems.map((item) => (
            <Link key={item.name} to={item.to} className="text-sm font-semibold text-gray-900">
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
      <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">MaFormation</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                alt="Logo"
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="size-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  
    </>
  )
}
