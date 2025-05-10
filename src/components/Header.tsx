import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import AuthButton from './AuthButton';

export default async function Header() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
          <span className="bg-blue-600 text-white p-1 rounded-md text-sm">MS</span>
          <span>MemberShift</span>
        </Link>
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <Link href="/my-listings" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                My Listings
              </Link>
              <Link href="/post-membership" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                Post Membership
              </Link>
            </>
          )}
          <AuthButton user={user} />
        </div>
      </nav>
    </header>
  );
}