'use client'

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { deleteListing } from '@/app/post-membership/actions'; // Use alias

interface DeleteListingButtonProps {
    listingId: string;
    ownerId?: string | null; 
    currentUserId?: string | null; 
}

export default function DeleteListingButton({ listingId, ownerId, currentUserId }: DeleteListingButtonProps) {
    if (currentUserId !== ownerId || !ownerId) {
        return null; 
    }
    
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleDelete = () => {
        if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
            return;
        }

        startTransition(async () => {
            setError(null);
            try {
                // Call the server action. It will redirect on success or throw on error.
                await deleteListing(listingId);
                // If deleteListing throws, the catch block below will handle it.
                // If it succeeds, the redirect happens on the server, 
                // so we don't need to do anything else here.

            } catch (err) {
                console.error('Error deleting listing:', err);
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                setError(errorMessage); // Set error state to display
            }
            // No finally block needed to reset pending state, useTransition handles it
        });
    };

    return (
        <>
            <button
                onClick={handleDelete}
                disabled={isPending}
                aria-disabled={isPending}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
                {isPending ? 'Deleting...' : 'Delete'}
            </button>
            {error && <p className="text-red-500 text-sm mt-1">Error: {error}</p>}
        </>
    );
}