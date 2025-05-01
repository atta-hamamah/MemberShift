import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import ListingForm from '@/components/ListingForm';
import { updateListing } from './actions';

export default async function EditListingPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/login?message=Please log in to edit listings&redirectTo=/listing/${params.id}/edit`);
    }

    const { data: listing, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !listing) {
        console.error('Error fetching listing:', error);
        notFound(); // Or show an error message
    }

    // Authorization check: Ensure the logged-in user owns the listing
    if (listing.user_id !== user.id) {
        // You might want a more user-friendly message or redirect
        return <div className="container mx-auto px-4 py-8 text-red-600">You are not authorized to edit this listing.</div>;
    }

    // Bind the listingId to the update action
    const updateListingWithId = updateListing.bind(null, listing.id);

    // Convert listing data keys if necessary to match form expectations (e.g., snake_case to camelCase)
    // Or ensure ListingForm and ListingData type use keys matching the database
    const initialFormData = {
        ...listing,
        // Example: Convert date strings if needed, though the form now handles formatting
        // start_date: listing.start_date ? new Date(listing.start_date).toISOString().split('T')[0] : null,
        // end_date: listing.end_date ? new Date(listing.end_date).toISOString().split('T')[0] : null,
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Edit Listing</h1>
            <ListingForm
                initialData={initialFormData}
                action={updateListingWithId}
                submitButtonText="Update Listing"
                pendingSubmitButtonText="Updating..."
            />
            {/* <p className="text-center text-gray-500">(Edit form component will go here)</p> */}
        </div>
    );
} 