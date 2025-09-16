/// <reference types="vite/client" />

declare module '@/contexts/AuthContext' {
  export function useAuth(): { user?: { id?: string; name?: string; email?: string; role?: string; avatar?: string }, logout: () => void }
}
