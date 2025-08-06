import { createFileRoute } from '@tanstack/react-router'
import FormationDetailPage from '@/pages/FormationsDetailPage'

export const Route = createFileRoute('/formations/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FormationDetailPage />
}
