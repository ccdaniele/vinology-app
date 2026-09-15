import Link from 'next/link'

export default function HomePage() {
  return (
    <section className="rise" style={{ display: 'grid', gap: '1.5rem', maxWidth: 640 }}>
      <h1 className="font-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', margin: 0, lineHeight: 1.05 }}>
        Your research desk
      </h1>
      <p className="muted" style={{ margin: 0, lineHeight: 1.6 }}>
        Start a named query, decode a VIN, save the vehicle, and download a PDF when you need a shareable snapshot.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Link href="/queries/new" className="btn">
          Create a query
        </Link>
        <Link href="/queries" className="btn btn-secondary">
          Open my queries
        </Link>
      </div>
    </section>
  )
}
