// RouterProviderWithAuth.tsx
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import  CustomErrorPage  from '@/pages/CustomErrorPage'

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => <CustomErrorPage />
})

export default function InnerApp() {

  return <RouterProvider router={router} />
}

