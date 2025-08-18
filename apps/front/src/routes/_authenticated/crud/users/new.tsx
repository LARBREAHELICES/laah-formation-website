
import { createFileRoute } from '@tanstack/react-router'
import NewUserPage from '@/pages/FormUsers'

export const Route = createFileRoute('/_authenticated/crud/users/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <NewUserPage/>
}
