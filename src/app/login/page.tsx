'use client';

import { createClient } from '@/lib/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorMessage = searchParams.get('message');
  const [redirectUrl, setRedirectUrl] = useState('');

  useEffect(() => {
    // Create redirect URL with required parameters
    const redirectTo = new URL('/auth/callback', window.location.origin);
    redirectTo.searchParams.set('type', 'email');
    redirectTo.searchParams.set('next', '/');
    setRedirectUrl(redirectTo.toString());

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/');
        router.refresh();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase, router]);

  const getErrorMessage = (error: string, message?: string | null) => {
    switch (error) {
      case 'missing_params':
        return 'Invalid login link: Missing required parameters.';
      case 'exchange_failed':
        return 'Login failed: The authentication code could not be verified.';
      case 'verify_failed':
        return 'Login failed: Could not verify the magic link.';
      case 'invalid_link':
        return 'The login link is invalid or has expired. Please try again.';
      default:
        return message || 'An unexpected error occurred during login.';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold text-center mb-6">Seller Login</h1>

      {error && <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">{getErrorMessage(error, errorMessage)}</div>}

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
          <br />
          Please check your spam folder if you don't receive the email.
        </p>
      </div>
    </div>
  );
}
