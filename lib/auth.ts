import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'gramamstays-admin-secret-key-2024'
const TOKEN_EXPIRY = '7d'

export type UserRole = 'super_admin' | 'admin' | 'staff'

export interface TokenPayload {
  userId: string
  username: string
  role: UserRole
}

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: ['dashboard', 'bookings', 'properties', 'financials', 'register', 'logs'],
  admin: ['dashboard', 'bookings', 'properties', 'financials', 'logs'],
  staff: ['dashboard', 'bookings', 'logs'],
}

export function getRolePermissions(role: UserRole): string[] {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.staff
}

export function canAccessSection(role: UserRole, section: string): boolean {
  return getRolePermissions(role).includes(section)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

export const AUTH_COOKIE = 'ga_token'
