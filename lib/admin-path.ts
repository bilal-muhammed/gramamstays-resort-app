export function getAdminPath(subpath?: string): string {
  const base = process.env.NEXT_PUBLIC_ADMIN_PATH || 'admin'
  if (subpath) return `/${base}${subpath}`
  return `/${base}`
}
