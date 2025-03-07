// app/MapWrapper.js
'use client'

import dynamic from 'next/dynamic'

const Map = dynamic(() => import('../components/Map'), { ssr: false })

export default function MapWrapper() {
  return <Map />
}