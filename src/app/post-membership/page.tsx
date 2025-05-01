// Placeholder for Post Membership page
import Link from 'next/link';
// import PostMembershipForm from '@/components/PostMembershipForm'; // Old import
import ListingForm from '@/components/ListingForm'; // New import
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { createListing } from './actions'; // Import the server action

export default async function PostMembershipPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Double-check auth on the server-side for the page itself
  if (!user) {
    redirect('/login?message=Please log in to post a membership');
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-6">Post a New Membership</h1>
      {/* <PostMembershipForm /> */}
      <ListingForm
        action={createListing} // Pass the server action
        submitButtonText="Post Membership"
        pendingSubmitButtonText="Posting..."
      />
    </div>
  );
} 