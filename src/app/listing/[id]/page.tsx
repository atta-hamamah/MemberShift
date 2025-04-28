import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DeleteListingButton from '@/components/DeleteListingButton';

interface ListingDetailsPageProps {
  params: { id: string };
}

// Helper function to format date strings
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Invalid Date';
  }
}

export default async function ListingDetailsPage({ params }: ListingDetailsPageProps) {
  const { id } = params;
  const supabase = createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the specific listing by ID
  const { data: listing, error } = await supabase
    .from('listings')
    .select('*') // Select all columns for the details page
    .eq('id', id)
    .single(); // Expect only one result

  // Handle not found case
  if (error || !listing) {
    console.error('Error fetching listing details:', error);
    notFound(); // Triggers the nearest not-found.tsx page (or default Next.js 404)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Back to Listings
        </Link>
        <DeleteListingButton
          listingId={listing.id}
          ownerId={listing.user_id}
          currentUserId={user?.id}
        />
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border">
        <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>

        <div className="mb-6 space-y-2 text-gray-700">
          <p><strong>Category:</strong> {listing.category}</p>
          <p><strong>Type:</strong> {listing.type}</p>
          <p><strong>Condition:</strong>
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full inline-block ${listing.condition === 'New' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {listing.condition}
            </span>
          </p>
          <p><strong>Price:</strong> <span className="text-2xl font-bold text-green-700">${listing.price.toFixed(2)}</span></p>
          {listing.start_date && <p><strong>Valid From:</strong> {formatDate(listing.start_date)}</p>}
          {listing.end_date && <p><strong>Valid Until:</strong> {formatDate(listing.end_date)}</p>}
        </div>

        {listing.type === 'Physical' && (
          <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h2 className="text-xl font-semibold mb-3">Location</h2>
            <p>{listing.address_details}</p>
            <p>{listing.city}, {listing.state}, {listing.country}</p>
          </div>
        )}

        {listing.description && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t">
          <h2 className="text-xl font-semibold mb-3">Contact Seller</h2>
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <p className="text-gray-800 font-medium break-words">{listing.contact_info}</p>
          </div>
          <p className="mt-2 text-xs text-gray-500">Please contact the seller directly using the information above to arrange purchase and transfer.</p>
        </div>
      </div>
    </div>
  );
}