'use client'

import { createClient } from '@/lib/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [redirectUrl, setRedirectUrl] = useState('')
  
  useEffect(() => {
    // Ensure the redirect URL is set using window.location in the browser
    setRedirectUrl(`${window.location.origin}/auth/callback`)
  }, [])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Redirect to home page after successful sign in
        router.push('/')
        router.refresh() // Ensure layout updates with user state
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase, router]);

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold text-center mb-6">Seller Login</h1>
      
      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
          {error === 'invalid_link' ? 'The login link is invalid or has expired. Please try again.' : 'An error occurred during login.'}
        </div>
      )}
      
      <div className="bg-white p-8 rounded-lg shadow-md border">
        {redirectUrl && (
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
            view="magic_link"
            showLinks={false}
            redirectTo={redirectUrl}
          />
        )}
        <p className="text-center text-sm text-gray-600 mt-4">
          Enter your email to receive a magic login link.
        </p>
      </div>
    </div>
  )
} 