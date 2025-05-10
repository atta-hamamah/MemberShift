'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

interface AuthButtonProps {
  user: User | null
}

export default function AuthButton({ user }: AuthButtonProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = () => {
    router.push('/login')
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh() // Refresh server components
  }

  return user ? (
    <button
      onClick={handleSignOut}
      className="btn btn-danger flex items-center space-x-1 shadow-sm"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span>Logout</span>
    </button>
  ) : (
    <button
      onClick={handleSignIn}
      className="btn btn-primary flex items-center space-x-1 shadow-sm"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
      <span>Seller Login</span>
    </button>
  )
}