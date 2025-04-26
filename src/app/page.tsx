import { createClient } from '@/lib/supabase/server';
import ListingCard from '@/components/ListingCard';
import type { Listing } from '@/components/ListingCard'; // Import the type
import FilterSearchForm from '@/components/FilterSearchForm'; // Import the form

// Define HomePageProps to accept searchParams for filtering later
interface HomePageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Home({ searchParams }: HomePageProps) {
  const supabase = createClient();

  // Extract filter/search values from URL search params - make sure searchParams is properly resolved
  const queryParam = searchParams.query as string || '';
  const typeParam = searchParams.type as string || '';
  const categoryParam = searchParams.category as string || '';
  const locationParam = searchParams.location as string || '';
  // Add pageParam later for pagination

  // Build the Supabase query
  let queryBuilder = supabase
    .from('listings')
    .select('id, title, category, type, price, condition, country, city')
    .order('created_at', { ascending: false });

  // Apply filters
  if (typeParam) {
    queryBuilder = queryBuilder.eq('type', typeParam);
  }
  if (categoryParam) {
    queryBuilder = queryBuilder.eq('category', categoryParam);
  }
  if (queryParam) {
    // Simple text search on title and description (case-insensitive)
    // Escape special characters for ilike
    const searchTerm = queryParam.replace(/[%_]/g, '\\$&');
    queryBuilder = queryBuilder.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }
  if (locationParam && typeParam !== 'Online') { // Only apply location filter if not explicitly Online
     // Search across city, state, country (case-insensitive)
     // Escape special characters for ilike
     const locationTerm = locationParam.replace(/[%_]/g, '\\$&');
     queryBuilder = queryBuilder.or(`city.ilike.%${locationTerm}%,state.ilike.%${locationTerm}%,country.ilike.%${locationTerm}%`);
  }

  // Add pagination later
  queryBuilder = queryBuilder.limit(20);

  // Execute the query
  const { data: listings, error } = await queryBuilder;

  // Basic error handling
  if (error) {
    console.error('Error fetching listings:', error);
  }

  // Message from query params
  const message = searchParams.message as string;

  return (
    <div className="w-full">
      {message && (
         <div className="p-3 mb-6 text-sm text-green-700 bg-green-100 rounded-lg border border-green-300">
            {message}
          </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Find Memberships</h1>

      {/* Filters and Search Section */}
      <div className="mb-8 p-4 border rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Filter & Search</h2>
         <FilterSearchForm />
      </div>

      {/* Listings Section */}
      {/* Listings Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Listings</h2>
        {error && <p className="text-red-500">Could not fetch listings: {error.message}. Please try again later.</p>}
        {!error && (!listings || listings.length === 0) && (
          <p className="text-gray-500">No listings found matching your criteria.</p>
        )}
        {listings && listings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing as Listing} />
            ))}
          </div>
        )}
        {/* Add pagination later if needed */}
      </div>
    </div>
  );
}
