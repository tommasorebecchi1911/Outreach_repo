import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

interface AuthUser {
  email: string
  role: string[]
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => ({
  auth: {
    user: null,
    setUser: (user) =>
      set((state) => ({ ...state, auth: { ...state.auth, user } })),
    accessToken: '',
    setAccessToken: (accessToken) =>
      set((state) => ({ ...state, auth: { ...state.auth, accessToken } })),
    reset: () => {
      supabase.auth.signOut()
      set((state) => ({
        ...state,
        auth: { ...state.auth, user: null, accessToken: '' },
      }))
    },
  },
}))
