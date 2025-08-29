
import { createFileRoute } from '@tanstack/react-router'
import DashboardBackOffice from '@/pages/DashBoardRegistration'

export const Route = createFileRoute('/_authenticated/crud/backoffice/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DashboardBackOffice/>
}
