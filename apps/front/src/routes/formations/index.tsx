import { createFileRoute } from '@tanstack/react-router'
import Formations from '@/pages/Formations'

export const Route = createFileRoute('/formations/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Formations />
}
