import { RequireAuth } from '@/components/RequireAuth'

export default function AppSectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RequireAuth>{children}</RequireAuth>
}
