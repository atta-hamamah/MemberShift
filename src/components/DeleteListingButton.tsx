'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteListing } from './../app/post-membership/actions'; // Adjust path as needed

interface DeleteListingButtonProps {
    listingId: string;
}

export default function DeleteListingButton({ listingId }: DeleteListingButtonProps) {
    console.log('Rendering delete button for listing:', listingId);
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        setError(null);

        try {
            // Call the server action
            await deleteListing(listingId);
            console.log('Listing deleted successfully');
            router.refresh();
        } catch (err) {
            console.error('Error deleting listing:', err);
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            alert(`Failed to delete listing: ${errorMessage}`);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
                {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </>
    );
}