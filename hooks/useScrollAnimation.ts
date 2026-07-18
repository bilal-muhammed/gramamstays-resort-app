'use client'

import { useInView } from 'react-intersection-observer'
import { useEffect, useState, useCallback } from 'react'

export function useScrollAnimation(options = {}) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    ...options,
  })

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (inView) {
      setIsVisible(true)
    }
  }, [inView])

  return { ref, isVisible }
}

export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY
    setScrollDirection(currentY > scrollY ? 'down' : 'up')
    setScrollY(currentY)
  }, [scrollY])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return { scrollY, scrollDirection }
}
