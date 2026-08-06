'use client'

import { useEffect, useState } from 'react'

function Leaf({ style }: { style: React.CSSProperties }) {
  return (
    <div className="forest-leaf" style={style}>
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M12 2C6.5 2 2 6.5 2 12c0 4 2.5 7.5 6 9 .5-2 1.5-4 4-6 2.5 2 3.5 4 4 6 3.5-1.5 6-5 6-9 0-5.5-4.5-10-10-10z" fill="currentColor" opacity="0.7"/>
        <path d="M12 2v20" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
      </svg>
    </div>
  )
}

function LeafParticles() {
  const [leaves] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 12 + Math.random() * 10,
      size: 10 + Math.random() * 14,
      rotate: Math.random() * 360,
      swingAmp: 30 + Math.random() * 40,
      opacity: 0.15 + Math.random() * 0.2,
      color: ['#4a6741', '#5a7a4f', '#3d5a36', '#6b8659'][Math.floor(Math.random() * 4)],
    }))
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {leaves.map(leaf => (
        <Leaf
          key={leaf.id}
          style={{
            left: `${leaf.left}%`,
            width: leaf.size,
            height: leaf.size,
            color: leaf.color,
            opacity: leaf.opacity,
            animation: `forest-leaf-fall ${leaf.duration}s linear ${leaf.delay}s infinite`,
            '--leaf-swing': `${leaf.swingAmp}px`,
            '--leaf-rotate': `${leaf.rotate}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

function DappledLight() {
  const [spots] = useState(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      top: 5 + Math.random() * 90,
      size: 60 + Math.random() * 120,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      opacity: 0.03 + Math.random() * 0.04,
    }))
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {spots.map(spot => (
        <div
          key={spot.id}
          className="forest-light-spot"
          style={{
            left: `${spot.left}%`,
            top: `${spot.top}%`,
            width: spot.size,
            height: spot.size,
            opacity: spot.opacity,
            animation: `forest-light-pulse ${spot.duration}s ease-in-out ${spot.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

function MistLayers() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      <div className="forest-mist forest-mist-1" />
      <div className="forest-mist forest-mist-2" />
      <div className="forest-mist forest-mist-3" />
    </div>
  )
}

function TreeCanopy() {
  return (
    <div className="fixed top-0 left-0 right-0 h-20 sm:h-32 md:h-40 pointer-events-none z-[3]">
      {/* Left canopy */}
      <svg className="absolute top-0 left-0 w-24 sm:w-48 md:w-72 h-full" viewBox="0 0 300 200" fill="none" preserveAspectRatio="xMinYMin slice">
        <path d="M0 0 L0 80 Q30 60 50 100 Q40 70 60 90 Q50 50 80 80 Q70 40 100 70 Q90 30 120 60 Q110 20 140 50 Q130 10 160 40 Q180 20 200 50 Q220 30 250 60 Q270 40 300 70 L300 0 Z" fill="#1a2e1d" opacity="0.5"/>
        <path d="M0 0 L0 50 Q20 35 40 65 Q35 40 55 55 Q50 25 75 50 Q70 15 95 40 Q90 5 115 30 Q120 15 140 35 L140 0 Z" fill="#2c4a30" opacity="0.6"/>
        <path d="M0 0 L0 30 Q15 20 25 40 Q30 25 45 38 Q50 18 65 32 Q75 15 90 28 L90 0 Z" fill="#3d5a36" opacity="0.4"/>
      </svg>

      {/* Right canopy */}
      <svg className="absolute top-0 right-0 w-24 sm:w-48 md:w-72 h-full" viewBox="0 0 300 200" fill="none" preserveAspectRatio="xMaxYMin slice">
        <path d="M300 0 L300 80 Q270 60 250 100 Q260 70 240 90 Q250 50 220 80 Q230 40 200 70 Q210 30 180 60 Q190 20 160 50 Q170 30 140 60 Q120 40 100 70 Q80 50 60 80 Q40 60 20 90 Q10 70 0 100 L0 0 Z" fill="#1a2e1d" opacity="0.5"/>
        <path d="M300 0 L300 50 Q280 35 260 65 Q265 40 245 55 Q250 25 225 50 Q230 15 205 40 Q210 5 185 30 Q180 15 160 35 L160 0 Z" fill="#2c4a30" opacity="0.6"/>
        <path d="M300 0 L300 30 Q285 20 275 40 Q270 25 255 38 Q250 18 235 32 Q225 15 210 28 L210 0 Z" fill="#3d5a36" opacity="0.4"/>
      </svg>

      {/* Center hanging branches - hidden on mobile, visible on sm+ */}
      <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] md:w-[900px] h-16 sm:h-24 md:h-32 hidden sm:block" viewBox="0 0 900 130" fill="none" preserveAspectRatio="xMidYMin slice">
        <path d="M0 0 Q100 5 200 0 Q250 15 300 5 Q350 20 400 8 Q450 25 500 10 Q550 20 600 5 Q650 15 700 0 Q800 10 900 0 L900 0 L0 0 Z" fill="#1a2e1d" opacity="0.35"/>
        <path d="M100 0 Q150 20 200 10 Q250 30 300 15 Q350 35 400 20 Q450 40 500 25 Q550 35 600 15 Q650 25 700 10 Q750 20 800 0" stroke="#2c4a30" strokeWidth="1.5" fill="none" opacity="0.3"/>
        <circle cx="180" cy="12" r="8" fill="#3d5a36" opacity="0.25"/>
        <circle cx="200" cy="8" r="6" fill="#4a6741" opacity="0.2"/>
        <circle cx="350" cy="18" r="7" fill="#3d5a36" opacity="0.25"/>
        <circle cx="500" cy="22" r="9" fill="#4a6741" opacity="0.2"/>
        <circle cx="650" cy="10" r="7" fill="#3d5a36" opacity="0.25"/>
        <circle cx="720" cy="15" r="6" fill="#4a6741" opacity="0.2"/>
      </svg>
    </div>
  )
}

export function ForestOverlay() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <TreeCanopy />
      <DappledLight />
      <MistLayers />
      <LeafParticles />
    </>
  )
}
