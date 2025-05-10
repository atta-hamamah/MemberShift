import Link from 'next/link';

// Define the expected shape of a listing object (adjust based on your actual data)
// Consider creating a shared types file later (e.g., src/types/index.ts)
export interface Listing {
  id: string;
  title: string;
  category: string;
  type: string;
  price: number;
  condition: string;
  country?: string | null;
  city?: string | null;
  // Add other fields you want to display on the card
}

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  // Get condition-based styling
  const conditionClasses = listing.condition === 'New' 
    ? 'bg-green-100 text-green-800 border-green-200' 
    : 'bg-amber-100 text-amber-800 border-amber-200';
    
  // Get category icon
  const getCategoryIcon = () => {
    switch(listing.category) {
      case 'Gym':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'Streaming':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'Software':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'Course':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
    }
  };

  return (
    <Link href={`/listing/${listing.id}`} className="card group overflow-hidden flex flex-col h-full hover:border-blue-300 hover:translate-y-[-2px] transition-all duration-200">
      {/* Card Header with Category Icon */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-gray-600">
          <span className="text-blue-500">{getCategoryIcon()}</span>
          <span className="font-medium">{listing.category}</span>
        </div>
        <div className={`text-xs px-2 py-1 rounded-full border ${conditionClasses}`}>
          {listing.condition}
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors truncate" title={listing.title}>
          {listing.title}
        </h3>
        
        <div className="text-sm text-gray-500 mb-3 flex items-center space-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>
            {listing.type}
            {listing.type === 'Physical' && (listing.city || listing.country) && (
              <span> - {listing.city}{listing.city && listing.country ? ', ' : ''}{listing.country}</span>
            )}
          </span>
        </div>
        
        <div className="mt-auto pt-2 border-t border-gray-100 flex justify-between items-center">
          <div className="text-xl font-bold text-blue-600">
            ${listing.price.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
            View Details
          </div>
        </div>
      </div>
    </Link>
  );
}