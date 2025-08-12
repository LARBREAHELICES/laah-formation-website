
import { createFileRoute } from '@tanstack/react-router'
import DashboardFormations from '@/pages/DashBoardFormations'

export const Route = createFileRoute('/admin/dashboard/formations/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DashboardFormations/>
}
