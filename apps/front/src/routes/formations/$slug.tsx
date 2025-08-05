import { createFileRoute } from '@tanstack/react-router'
import FormationDetailPage from '@/pages/FormationsDetailPage'

export const Route = createFileRoute('/formations/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FormationDetailPage />
}
