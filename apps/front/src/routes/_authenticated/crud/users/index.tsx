
import { createFileRoute } from '@tanstack/react-router'
import DashboardUsers from '@/pages/DashBoardUsers'

export const Route = createFileRoute('/_authenticated/crud/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DashboardUsers/>
}
