import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  // Create a server supabase client with the app's cookies
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // The `set` method is called automatically by the Supabase client
          // when using the Server Client. We don't need to manually handle it here
          // for most auth operations when middleware is configured.
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component or Route Handler.
          }
        },
        remove(name: string, options: CookieOptions) {
          // The `delete` method is called automatically by the Supabase client
          try {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 })
          } catch (error) {
            // The `delete` method was called from a Server Component or Route Handler.
          }
        },
      },
    }
  )
}

// Variant for Route Handlers and Server Actions which need to pass the cookieStore
export function createClientWithStore(cookieStore: ReturnType<typeof cookies>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component or Route Handler.
            // This typically happens during sign-in or session refresh.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 })
          } catch (error) {
            // The `delete` method was called from a Server Component or Route Handler.
            // This typically happens during sign-out.
          }
        },
      },
    }
  )
}