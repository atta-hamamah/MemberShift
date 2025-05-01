'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Define the schema for validation using Zod
const ListingSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long'),
    price: z.coerce.number().positive('Price must be a positive number'),
    type: z.string().min(1, 'Type is required'),
    // Add other fields from your listing form here
});

export async function updateListing(listingId: string, formData: FormData) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: 'Authentication required.' };
    }

    const rawFormData = {
        title: formData.get('title'),
        price: formData.get('price'),
        type: formData.get('type'),
        // Get other fields
    };

    const validationResult = ListingSchema.safeParse(rawFormData);

    if (!validationResult.success) {
        console.error('Validation Error:', validationResult.error.flatten().fieldErrors);
        // Return specific error messages to the form
        return { 
            success: false, 
            message: 'Validation failed', 
            errors: validationResult.error.flatten().fieldErrors 
        };
    }

    const validatedData = validationResult.data;

    // Verify ownership before updating
    const { data: existingListing, error: fetchError } = await supabase
        .from('listings')
        .select('user_id')
        .eq('id', listingId)
        .single();

    if (fetchError || !existingListing) {
        console.error('Error fetching listing for ownership check:', fetchError);
        return { success: false, message: 'Failed to verify listing ownership.' };
    }

    if (existingListing.user_id !== user.id) {
        return { success: false, message: 'You are not authorized to update this listing.' };
    }

    // Proceed with the update
    const { error: updateError } = await supabase
        .from('listings')
        .update({
            title: validatedData.title,
            price: validatedData.price,
            type: validatedData.type,
            // Add other validated fields
        })
        .eq('id', listingId);

    if (updateError) {
        console.error('Supabase Update Error:', updateError);
        return { success: false, message: 'Failed to update listing. ' + updateError.message };
    }

    // Revalidate paths to show updated data
    revalidatePath('/my-listings');
    revalidatePath(`/listing/${listingId}`);
    revalidatePath(`/listing/${listingId}/edit`); // Revalidate edit page itself?

    // Redirect after successful update
    redirect(`/listing/${listingId}?message=Listing updated successfully`); 
    // Or redirect('/my-listings');

    // Note: Redirect throws an error, so code below won't execute. 
    // A return statement might be needed if not redirecting immediately
    // return { success: true, message: 'Listing updated successfully.' };
} 