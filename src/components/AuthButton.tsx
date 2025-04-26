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
      className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
    >
      Logout
    </button>
  ) : (
    <button
      onClick={handleSignIn}
      className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
    >
      Seller Login
    </button>
  )
} 