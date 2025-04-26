import { createClientWithStore } from '@/lib/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (!token_hash || !type) {
    console.error('Auth callback error: Missing token_hash or type');
    return NextResponse.redirect(new URL('/login?error=invalid_link', request.url).toString());
  }

  const cookieStore = cookies()
  const supabase = createClientWithStore(cookieStore)

  try {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (error) {
      console.error('Auth callback error:', error.message);
      return NextResponse.redirect(new URL(`/login?error=invalid_link`, request.url).toString());
    }
    
    // Authentication successful, redirect to the next page
    return NextResponse.redirect(new URL(next, request.url).toString())
  } catch (err) {
    console.error('Unexpected error during authentication:', err);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url).toString());
  }
}