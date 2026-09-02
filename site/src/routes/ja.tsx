import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ja')({
  component: () => <Outlet />,
})
