import { createFileRoute } from '@tanstack/react-router'
import AdminDashboardHome from '@/pages/DashBoard'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AdminDashboardHome />
}
