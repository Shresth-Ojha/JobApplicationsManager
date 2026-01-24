import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
    id: string
    email: string
    firstName?: string
    lastName?: string
    avatarUrl?: string
}

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isGuest: boolean
    login: (user: User, token: string) => void
    loginAsGuest: () => void
    logout: (clearGuestData?: boolean) => void
}

const generateGuestId = () => `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isGuest: false,
            login: (user, token) => set({ user, token, isAuthenticated: true, isGuest: false }),
            loginAsGuest: () => set({
                user: {
                    id: generateGuestId(),
                    email: 'guest@local',
                    firstName: 'Guest',
                    lastName: 'User',
                },
                token: 'guest-token',
                isAuthenticated: true,
                isGuest: true,
            }),
            logout: (clearGuestData = false) => {
                if (clearGuestData) {
                    localStorage.removeItem('guest-applications')
                }
                set({ user: null, token: null, isAuthenticated: false, isGuest: false })
            },
        }),
        {
            name: 'auth-storage',
        }
    )
)

