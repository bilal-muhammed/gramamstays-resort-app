export function getAdminPath(subpath?: string): string {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname
    const match = path.match(/^\/([^/]+)/)
    if (match && match[1] !== 'admin' && match[1] !== 'api' && match[1] !== 'properties') {
      const base = match[1]
      if (subpath) return `/${base}${subpath}`
      return `/${base}`
    }
  }
  if (subpath) return `/admin${subpath}`
  return '/admin'
}
