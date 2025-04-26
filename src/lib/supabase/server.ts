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
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // The `set` method is called automatically by the Supabase client
          // when using the Server Client. We don't need to manually handle it here
          // for most auth operations when middleware is configured.
          // If you need to specifically set cookies in Server Actions, use the passed cookieStore instance.
        },
        remove(name: string, options: CookieOptions) {
          // The `delete` method is called automatically by the Supabase client
          // when using the Server Client. We don't need to manually handle it here
          // for most auth operations when middleware is configured.
          // If you need to specifically remove cookies in Server Actions, use the passed cookieStore instance.
          // For sign-out in Server Actions, you can use cookieStore.delete(name)
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
          get(name: string) {
            return cookieStore.get(name)?.value
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
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // The `delete` method was called from a Server Component or Route Handler.
              // This typically happens during sign-out.
            }
          },
        },
      }
    )
  } 