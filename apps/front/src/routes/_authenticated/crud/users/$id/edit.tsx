
import { createFileRoute } from '@tanstack/react-router'
import EditUserPage from '@/pages/EditUserPage'

export const Route = createFileRoute('/_authenticated/crud/users/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <EditUserPage/>
}
