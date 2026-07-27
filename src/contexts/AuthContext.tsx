import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import {
  subscribeToAuthState,
  getUserProfile,
  registerUser,
  loginWithPhone,
  logout as fbLogout,
  resetPasswordForPhone,
  friendlyAuthError,
  type RegisterInput,
  type UserProfile,
} from '../firebase/auth'

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  isOnline: boolean
  register: (input: RegisterInput) => Promise<void>
  login: (phone: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  resetPassword: (phone: string) => Promise<string>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        try {
          const p = await getUserProfile(firebaseUser.uid)
          setProfile(p)
        } catch {
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const register = useCallback(async (input: RegisterInput) => {
    try {
      const firebaseUser = await registerUser(input)
      const p = await getUserProfile(firebaseUser.uid)
      setUser(firebaseUser)
      setProfile(p)
    } catch (err) {
      throw new Error(friendlyAuthError(err))
    }
  }, [])

  const login = useCallback(async (phone: string, password: string) => {
    try {
      const firebaseUser = await loginWithPhone(phone, password)
      const p = await getUserProfile(firebaseUser.uid)
      setUser(firebaseUser)
      setProfile(p)
    } catch (err) {
      throw new Error(friendlyAuthError(err))
    }
  }, [])

  const logout = useCallback(async () => {
    await fbLogout()
    setUser(null)
    setProfile(null)
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!user) return
    const p = await getUserProfile(user.uid)
    setProfile(p)
  }, [user])

  const resetPassword = useCallback(async (phone: string) => {
    try {
      return await resetPasswordForPhone(phone)
    } catch (err) {
      throw new Error(friendlyAuthError(err))
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading, isOnline, register, login, logout, refreshProfile, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
