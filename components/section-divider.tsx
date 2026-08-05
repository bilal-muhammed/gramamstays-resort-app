'use client'

export function SectionDivider({ variant = 'default' }: { variant?: 'default' | 'ornament' }) {
  if (variant === 'ornament') {
    return (
      <div className="relative py-4 flex items-center justify-center">
        <div className="absolute left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
        <div className="relative z-10 w-2 h-2 rounded-full bg-secondary/30 ring-4 ring-background" />
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
    </div>
  )
}
