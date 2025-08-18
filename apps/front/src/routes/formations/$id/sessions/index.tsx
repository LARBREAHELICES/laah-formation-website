
import { createFileRoute } from '@tanstack/react-router'
import FormationSessionsPage from '@/pages/FormationsSessionPage'

export const Route = createFileRoute('/formations/$id/sessions/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FormationSessionsPage />
}
