import Link from 'next/link'

export default function LandingPage() {
  return (
    <main id="main" className="shell" style={{ minHeight: '100vh', display: 'grid', alignContent: 'center', gap: '2rem', paddingBlock: '3rem' }}>
      <p className="muted rise" style={{ letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: '0.78rem' }}>
        VIN research desk
      </p>
      <h1 className="font-display rise rise-delay" style={{ fontSize: 'clamp(3rem, 10vw, 5.5rem)', lineHeight: 0.95, margin: 0, maxWidth: '12ch' }}>
        Vinology
      </h1>
      <p className="rise rise-delay muted" style={{ maxWidth: '36rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
        Look up a vehicle by VIN with free NHTSA data, keep research in named queries, and export a PDF report.
      </p>
      <div className="rise rise-delay" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Link href="/login" className="btn">
          Sign in
        </Link>
        <Link href="/register" className="btn btn-secondary">
          Create account
        </Link>
      </div>
      <div
        className="rise rise-delay vin-plate font-mono"
        style={{ marginTop: '1rem', width: 'fit-content' }}
        aria-label="Example VIN"
      >
        JN8DR09Y82W703284
      </div>
    </main>
  )
}
