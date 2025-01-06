// app/page.js
'use client'
import MapWrapper from './MapWrapper'

export default function HomePage() {
  return (
    <main style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Your Leaflet map */}
      <MapWrapper />
    </main>
  )
}
