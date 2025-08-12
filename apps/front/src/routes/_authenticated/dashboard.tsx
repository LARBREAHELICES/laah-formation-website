import { createFileRoute } from '@tanstack/react-router'
import AdminDashboardHome from '@/pages/DashBoard'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AdminDashboardHome />
}
