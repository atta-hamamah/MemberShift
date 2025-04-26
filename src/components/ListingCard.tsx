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
  return (
    <Link href={`/listing/${listing.id}`} className="block border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-semibold mb-1 truncate" title={listing.title}>{listing.title}</h3>
      <div className="text-sm text-gray-600 mb-2">
        <span className="font-medium">{listing.category}</span> | <span>{listing.type}</span>
        {listing.type === 'Physical' && (listing.city || listing.country) && (
          <span> | {listing.city}{listing.city && listing.country ? ', ' : ''}{listing.country}</span>
        )}
      </div>
      <div className="text-xl font-bold mb-2">${listing.price.toFixed(2)}</div>
      <div className="text-xs px-2 py-0.5 rounded-full inline-block 
        {listing.condition === 'New' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}"
      >
        {listing.condition}
      </div>
    </Link>
  );
} 