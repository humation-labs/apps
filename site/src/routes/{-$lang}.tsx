import { Outlet, createFileRoute, notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$lang}')({
  beforeLoad: ({ params }) => {
    const { lang } = params
    if (lang === undefined || lang === 'ja') return
    throw notFound()
  },
  component: LangLayout,
})

function LangLayout() {
  return <Outlet />
}
