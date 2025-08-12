
import { createFileRoute } from '@tanstack/react-router'
import EditFormationPage from '@/pages/ModifyFormFormations'

export const Route = createFileRoute('/_authenticated/crud/formations/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <EditFormationPage/>
}
