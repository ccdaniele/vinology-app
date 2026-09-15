import { Suspense } from 'react'
import NewCarClient from './NewCarClient'

export default function Page() {
  return (
    <Suspense fallback={<p className="muted">Loading…</p>}>
      <NewCarClient />
    </Suspense>
  )
}
