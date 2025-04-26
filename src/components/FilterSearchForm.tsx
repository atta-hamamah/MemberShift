'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline' // Simple icon

// Define available categories (can be fetched dynamically if needed)
const categories = [
  'Gym', 'Streaming', 'Software', 'Course', 'Club', 'Subscription Box', 'Other'
];

export default function FilterSearchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Function to update search params and trigger navigation
  const handleFilterChange = (newParams: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    // Update or remove params
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });

    // Reset page number if filters change (for pagination later)
    current.delete('page'); 

    const search = current.toString();
    const query = search ? `?${search}` : '';

    startTransition(() => {
      router.push(`${pathname}${query}`);
    });
  };

  // Handle specific input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    handleFilterChange({ [e.target.name]: e.target.value });
  };
  
  // Debounced handler for search input (optional but recommended for better UX)
  let timeoutId: NodeJS.Timeout | null = null;
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
       handleFilterChange({ 'query': value });
    }, 500); // Debounce time (500ms)
  };

  // Clear all filters
  const clearFilters = () => {
     startTransition(() => {
      router.push(pathname); // Navigate to path without search params
    });
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
         <label htmlFor="search-query" className="sr-only">Search Listings</label>
         <input
            type="text"
            id="search-query"
            name="query" // Name matches the search param key
            placeholder="Search by title or description..."
            defaultValue={searchParams.get('query') || ''} // Set initial value from URL
            onChange={handleSearchChange} // Use debounced handler
            disabled={isPending}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Type Filter */}
        <div>
          <label htmlFor="filter-type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            id="filter-type"
            name="type" // Name matches the search param key
            value={searchParams.get('type') || ''} // Set initial value from URL
            onChange={handleInputChange}
            disabled={isPending}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50"
          >
            <option value="">All Types</option>
            <option value="Online">Online</option>
            <option value="Physical">Physical</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="filter-category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            id="filter-category"
            name="category" // Name matches the search param key
            value={searchParams.get('category') || ''} // Set initial value from URL
            onChange={handleInputChange}
            disabled={isPending}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

         {/* Location Filter (only if Physical type is selected or no type filter) */}
         {(searchParams.get('type') === 'Physical' || !searchParams.get('type')) && (
            <div>
              <label htmlFor="filter-location" className="block text-sm font-medium text-gray-700 mb-1">Location (City/State/Country)</label>
               <input
                type="text"
                id="filter-location"
                name="location" // Name matches the search param key
                placeholder="e.g., London"
                defaultValue={searchParams.get('location') || ''} // Set initial value from URL
                onChange={handleSearchChange} // Debounced is fine here too
                disabled={isPending || searchParams.get('type') === 'Online'} // Disable if Online is explicitly selected
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50 disabled:bg-gray-100"
              />
          </div>
         )}

        {/* Clear Filters Button */} 
         <div className="flex items-end">
            <button
                onClick={clearFilters}
                disabled={isPending || !searchParams.toString()}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Clear Filters
            </button>
        </div>

      </div>
       {isPending && <p className="text-sm text-gray-500 text-center mt-2">Updating results...</p>}
    </div>
  );
} 