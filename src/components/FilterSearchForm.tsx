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
    <div className="space-y-5">
      {/* Search Input */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative flex-grow">
          <label htmlFor="search-query" className="block text-sm font-medium text-gray-700 mb-2">
            <span className="flex items-center gap-1">
              <MagnifyingGlassIcon className="h-4 w-4 text-blue-500" aria-hidden="true" />
              Search
            </span>
          </label>
          <input
            type="text"
            id="search-query"
            name="query" // Name matches the search param key
            placeholder="Search by title or description..."
            defaultValue={searchParams.get('query') || ''} // Set initial value from URL
            onChange={handleSearchChange} // Use debounced handler
            disabled={isPending}
            className="input focus:border-blue-500 transition-all duration-200"
          />
        </div>

        {/* Type Filter */}
        <div className="md:w-48">
          <label htmlFor="filter-type" className="block text-sm font-medium text-gray-700 mb-2">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Type
            </span>
          </label>
          <select
            id="filter-type"
            name="type" // Name matches the search param key
            value={searchParams.get('type') || ''} // Set initial value from URL
            onChange={handleInputChange}
            disabled={isPending}
            className="select focus:border-blue-500 transition-all duration-200"
          >
            <option value="">All Types</option>
            <option value="Online">Online</option>
            <option value="Physical">Physical</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="md:w-48">
          <label htmlFor="filter-category" className="block text-sm font-medium text-gray-700 mb-2">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Category
            </span>
          </label>
          <select
            id="filter-category"
            name="category" // Name matches the search param key
            value={searchParams.get('category') || ''} // Set initial value from URL
            onChange={handleInputChange}
            disabled={isPending}
            className="select focus:border-blue-500 transition-all duration-200"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Location Filter (only if Physical type is selected or no type filter) */}
        {(searchParams.get('type') === 'Physical' || !searchParams.get('type')) && (
          <div className="md:w-48">
            <label htmlFor="filter-location" className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Location
              </span>
            </label>
            <input
              type="text"
              id="filter-location"
              name="location" // Name matches the search param key
              placeholder="e.g., London"
              defaultValue={searchParams.get('location') || ''} // Set initial value from URL
              onChange={handleSearchChange} // Debounced is fine here too
              disabled={isPending || searchParams.get('type') === 'Online'} // Disable if Online is explicitly selected
              className="input focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:bg-gray-100"
            />
          </div>
        )}

        {/* Clear Filters Button */}
        <div className="md:self-end">
          <button
            onClick={clearFilters}
            disabled={isPending || !searchParams.toString()}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
        </div>
      </div>
       {isPending && 
        <div className="flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-md border border-blue-100">
          <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Updating results...</span>
        </div>
       }
    </div>
  );
} 