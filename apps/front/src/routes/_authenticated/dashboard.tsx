import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
    

    useEffect(() => {
       console.log('je suis le dashboard')
    }, [])

  return (
    <div>
        <h1>Dashboard !!</h1>
    </div>
  )
    
}
