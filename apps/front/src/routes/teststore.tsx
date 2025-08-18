import { createFileRoute } from '@tanstack/react-router'

import { useModuleStore } from '@/stores/useModule'
import { useUserStore } from '@/stores/useUser'
import { useTagStore } from '@/stores/useTag'
import { useEffect } from "react"

export const Route = createFileRoute('/teststore')({
  component: RouteComponent,
})

function RouteComponent() {

  const { tags, fetchTags } = useTagStore()
  const { modules, fetchModules } = useModuleStore()
  const { users, fetchUsers } = useUserStore()

  useEffect(() => {
    fetchTags()
    fetchModules()
    fetchUsers()
  }, [])

  console.log("users", users)
  console.log("modules", modules)
  console.log("tags", tags)

  return <div>Hello "/teststore"!</div>
}
