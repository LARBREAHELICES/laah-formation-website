
import { createFileRoute } from '@tanstack/react-router'
import NewFormationPage from '@/pages/FormFormations'

export const Route = createFileRoute('/_authenticated/crud/formations/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <NewFormationPage/>
}
