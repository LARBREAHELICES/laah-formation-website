
import { createFileRoute } from '@tanstack/react-router'
import EditFormationPage from '@/pages/EditFormationPage'

export const Route = createFileRoute('/_authenticated/crud/formations/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <EditFormationPage/>
}
