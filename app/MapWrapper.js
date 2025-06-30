// app/MapWrapper.js
'use client'

import dynamic from 'next/dynamic'

const Map = dynamic(() => import('@/components/Map.js'), {
  ssr: false,
  loading: () => <div>Loading map...</div>
})

export default function MapWrapper() {
  return (
      <Map />
  )
}