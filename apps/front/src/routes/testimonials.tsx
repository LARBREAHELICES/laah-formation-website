import { createFileRoute } from '@tanstack/react-router'


import TestimonialSection from '@/components/TestimonialSection'

export const Route = createFileRoute('/testimonials')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TestimonialSection />
}
