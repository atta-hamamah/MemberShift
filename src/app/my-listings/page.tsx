import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import DeleteListingButton from '@/components/DeleteListingButton';

export default async function MyListingsPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Redirect to login if not authenticated
    if (!user) {
        redirect('/login?message=Please log in to view your listings');
    }

    // Fetch user's listings
    const { data: listings } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Listings</h1>

            {listings && listings.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {listings.map((listing) => (
                        <div key={listing.id} className="bg-white rounded-lg shadow-md p-6 border">
                            <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
                            <p className="text-gray-600 mb-2">Price: ${listing.price.toFixed(2)}</p>
                            <p className="text-gray-600 mb-4">Type: {listing.type}</p>

                            <div className="flex space-x-3">
                                <Link
                                    href={`/listing/${listing.id}`}
                                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    View
                                </Link>
                                <Link
                                    href={`/listing/${listing.id}/edit`}
                                    className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                >
                                    Edit
                                </Link>
                                <DeleteListingButton listingId={listing.id} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You haven&apos;t posted any listings yet.</p>
                    <Link
                        href="/post-membership"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Post Your First Membership
                    </Link>
                </div>
            )}
        </div>
    );
}