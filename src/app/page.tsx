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

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10 border border-blue-100 shadow-sm">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Find Your Perfect <span className="text-blue-600">Membership</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover and buy memberships and subscriptions at great prices. From gym access to streaming services, find what you need.
          </p>
        </div>
      </div>

      {/* Filters and Search Section */}
      <div className="mb-10 p-6 border rounded-xl bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter & Search
        </h2>
         <FilterSearchForm />
      </div>

      {/* Listings Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Available Listings
        </h2>
        {error && 
          <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-lg mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Could not fetch listings: {error.message}. Please try again later.</p>
          </div>
        }
        {!error && (!listings || listings.length === 0) && (
          <div className="p-8 border border-gray-200 bg-gray-50 rounded-lg text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-600 text-lg">No listings found matching your criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or check back later for new listings.</p>
          </div>
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
