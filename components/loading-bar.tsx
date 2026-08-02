'use client'

import { useEffect, useRef, Suspense, createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'

NProgress.configure({ showSpinner: false, minimum: 0.16, speed: 400 })

interface LoadingContextType {
  isLoading: boolean
  startLoading: () => void
  doneLoading: () => void
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  startLoading: () => {},
  doneLoading: () => {},
})

export function useLoading() {
  return useContext(LoadingContext)
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const countRef = useRef(0)

  const startLoading = useCallback(() => {
    countRef.current++
    setIsLoading(true)
    NProgress.start()
  }, [])

  const doneLoading = useCallback(() => {
    countRef.current = Math.max(0, countRef.current - 1)
    if (countRef.current === 0) {
      setIsLoading(false)
      NProgress.done()
    }
  }, [])

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, doneLoading }}>
      {children}
      {isLoading && (
        <div
          className="fixed inset-0 z-[90] cursor-wait"
          style={{ pointerEvents: 'all', background: 'transparent' }}
          onClick={(e) => e.preventDefault()}
          onMouseDown={(e) => e.preventDefault()}
          onMouseUp={(e) => e.preventDefault()}
        />
      )}
    </LoadingContext.Provider>
  )
}

function LoadingBarInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const prevPath = useRef(pathname)
  const prevSearch = useRef(searchParams.toString())

  useEffect(() => {
    const currentPath = pathname
    const currentSearch = searchParams.toString()

    if (currentPath !== prevPath.current || currentSearch !== prevSearch.current) {
      NProgress.start()
      prevPath.current = currentPath
      prevSearch.current = currentSearch
    }

    NProgress.done()
  }, [pathname, searchParams])

  return null
}

export function LoadingBar() {
  return (
    <LoadingProvider>
      <Suspense fallback={null}>
        <LoadingBarInner />
      </Suspense>
    </LoadingProvider>
  )
}

export function startLoading() {
  NProgress.start()
}

export function doneLoading() {
  NProgress.done()
}
