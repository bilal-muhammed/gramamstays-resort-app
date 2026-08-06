'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { X } from 'lucide-react'

interface AppSheetProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  maxWidth?: string
}

export function AppSheet({ open, onClose, title, subtitle, children, maxWidth = 'sm:max-w-lg' }: AppSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startY = useRef(0)
  const currentY = useRef(0)

  useEffect(() => {
    if (open) {
      setVisible(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimating(true)))
    } else {
      setAnimating(false)
      const t = setTimeout(() => setVisible(false), 300)
      return () => clearTimeout(t)
    }
  }, [open])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const scrollTop = contentRef.current?.scrollTop ?? 0
    if (scrollTop > 0) return
    startY.current = e.touches[0].clientY
    setDragging(true)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging) return
    const diff = e.touches[0].clientY - startY.current
    if (diff > 0) {
      currentY.current = diff
      setDragY(diff)
    }
  }, [dragging])

  const handleTouchEnd = useCallback(() => {
    if (dragY > 120) {
      onClose()
    }
    setDragY(0)
    setDragging(false)
    currentY.current = 0
  }, [dragY, onClose])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const scrollTop = contentRef.current?.scrollTop ?? 0
    if (scrollTop > 0) return
    startY.current = e.clientY
    setDragging(true)

    const handleMove = (ev: MouseEvent) => {
      const diff = ev.clientY - startY.current
      if (diff > 0) {
        currentY.current = diff
        setDragY(diff)
      }
    }
    const handleUp = () => {
      if (currentY.current > 120) onClose()
      setDragY(0)
      setDragging(false)
      currentY.current = 0
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
  }, [onClose])

  if (!visible) return null

  const progress = Math.min(dragY / 120, 1)
  const opacity = 1 - progress * 0.5

  return (
    <div className="fixed inset-0 z-[70]" style={{ opacity }}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${animating ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`absolute bottom-0 left-0 right-0 ${maxWidth} mx-auto transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${animating ? 'translate-y-0' : 'translate-y-full'} ${dragging ? 'transition-none' : ''}`}
        style={{ transform: dragging ? `translateY(${dragY}px)` : undefined, touchAction: 'none' }}
      >
        <div className="bg-white rounded-t-[20px] shadow-[0_-4px_30px_rgba(0,0,0,0.12)] max-h-[92vh] flex flex-col overflow-hidden">
          {/* Drag Handle */}
          <div
            className="flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
          >
            <div className="w-9 h-1 rounded-full bg-gray-300" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">{title}</h3>
              {subtitle && <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <X size={16} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div ref={contentRef} className="flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
