import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <Navigation />
      <Outlet />
      <Footer/>
    </React.Fragment>
  )
}
