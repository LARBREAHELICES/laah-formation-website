
import { createFileRoute } from '@tanstack/react-router'
import FormationSessionRegisterPage from '@/pages/FormFormationsRegister'

export const Route = createFileRoute('/formations/$id/sessions/$sessionId/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FormationSessionRegisterPage />
}
