import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import AuthButton from './AuthButton';

export default async function Header() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-10">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
          MemberShift
        </Link>
        <div className="flex items-center space-x-4">
          {user && (
            <Link href="/post-membership" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
              Post Membership
            </Link>
          )}
          <AuthButton user={user} />
        </div>
      </nav>
    </header>
  );
} 