import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import Navigation from '@/components/Navigation'
import Divider from '@/components/Divider'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <Navigation />
      <Divider />
      <Outlet />
    </React.Fragment>
  )
}
