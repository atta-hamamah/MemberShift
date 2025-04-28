import { createClientWithStore } from '@/lib/supabase/server';
import { type EmailOtpType } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null;
  const next = requestUrl.searchParams.get('next') ?? '/';

  console.log('Auth callback received:', {
    hasCode: !!code,
    hasTokenHash: !!token_hash,
    type,
    next,
  });

  // Check if we have either a code or token_hash, as Supabase auth can use either
  if ((!code && !token_hash) || !type) {
    console.error('Auth callback error: Missing auth parameters', { code, token_hash, type });
    return NextResponse.redirect(new URL('/login?error=missing_params', request.url));
  }

  const cookieStore = cookies();
  const supabase = createClientWithStore(cookieStore);

  try {
    if (code) {
      console.log('Attempting code exchange...');
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        console.error('Code exchange error:', exchangeError);
        return NextResponse.redirect(new URL(`/login?error=exchange_failed&message=${encodeURIComponent(exchangeError.message)}`, request.url));
      }
      console.log('Code exchange successful:', { userId: data.user?.id });
    } else if (token_hash) {
      console.log('Attempting OTP verification...');
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });
      if (verifyError) {
        console.error('OTP verification error:', verifyError);
        return NextResponse.redirect(new URL(`/login?error=verify_failed&message=${encodeURIComponent(verifyError.message)}`, request.url));
      }
      console.log('OTP verification successful:', { userId: data.user?.id });
    }

    // Successful authentication
    console.log('Authentication successful, redirecting to:', next);
    return NextResponse.redirect(new URL(next, request.url));
  } catch (error) {
    console.error('Unexpected authentication error:', error);
    return NextResponse.redirect(new URL(`/login?error=unexpected&message=${encodeURIComponent((error as Error).message)}`, request.url));
  }
}
