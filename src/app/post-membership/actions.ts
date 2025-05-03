'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'; // Import Zod

// Define the expected state structure returned by the action
type FormState = {
  success: boolean;
  message?: string | null;
  errors?: Record<string, string[] | undefined> | null; 
};

// Define a Zod schema for validation
const ListingSchema = z.object({
  user_id: z.string().uuid(),
  type: z.enum(['Online', 'Physical']),
  category: z.string().min(1, { message: 'Category is required' }),
  title: z.string().min(1, { message: 'Title is required' }).max(100),
  description: z.string().max(500).optional().nullable(),
  condition: z.enum(['New', 'Partially Used']),
  start_date: z.string().optional().nullable(), // Could add date validation
  end_date: z.string().optional().nullable(),   // Could add date validation
  price: z.coerce.number().min(0, { message: 'Price must be positive' }),
  contact_info: z.string().min(1, { message: 'Contact info is required' }).max(200),
  // Conditional validation for Physical type
  country: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  address_details: z.string().optional().nullable(),
}).refine(data => {
  if (data.type === 'Physical') {
    return data.country && data.state && data.city; 
  }
  return true;
}, {
  message: "Country, State, and City are required for Physical memberships",
  path: ['country', 'state', 'city'], // Indicate related fields
});

export async function createListing(
  prevState: FormState, // Previous state from useFormState
  formData: FormData
): Promise<FormState> { // Return type must be the state
  const supabase = createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.error('Error: User not authenticated to create listing.');
    // Instead of redirecting, return an error state
    return { success: false, message: 'Please log in to post a membership' };
  }

  const rawData = {
    user_id: user.id,
    type: formData.get('type') as string,
    category: formData.get('category') as string,
    country: formData.get('country') as string | null,
    state: formData.get('state') as string | null,
    city: formData.get('city') as string | null,
    address_details: formData.get('address_details') as string | null,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    condition: formData.get('condition') as string,
    start_date: formData.get('start_date') ? formData.get('start_date') as string : null,
    end_date: formData.get('end_date') ? formData.get('end_date') as string : null,
    price: formData.get('price'), // Keep as string or undefined for Zod coercion
    contact_info: formData.get('contact_info') as string,
  }

  // Clear location fields if type is Online
  if (rawData.type === 'Online') {
    rawData.country = null;
    rawData.state = null;
    rawData.city = null;
    rawData.address_details = null;
  }

  // Validate data using Zod
  const validatedFields = ListingSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.log('Validation errors:', validatedFields.error.flatten().fieldErrors);
    return {
        success: false,
        message: 'Validation failed. Please check the highlighted fields.',
        errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Use validated data for insertion
  const { error } = await supabase.from('listings').insert([validatedFields.data]);

  if (error) {
    console.error('Supabase insert error:', error);
    return { 
        success: false, 
        message: `Database Error: ${error.message}` 
    };
  }

  // Revalidate paths
  revalidatePath('/')
  revalidatePath('/my-listings') // Also revalidate my-listings

  // Redirect on success using the redirect function
  // Note: redirect() throws an error, so the code below it won't execute
  // in the successful case, but we satisfy the Promise<FormState> return type.
  redirect('/?message=Listing posted successfully!')

  // This part is technically unreachable due to redirect, but satisfies TS return type
  // return { success: true, message: 'Listing posted successfully!' }; 
}

export async function deleteListing(listingId: string) {
  const supabase = createClient()
  console.log('Attempting to delete listing with ID:', listingId)

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('You must be logged in to delete a listing')
  }

  // Verify the listing exists and get its details
  const { data: listing, error: fetchError } = await supabase
    .from('listings')
    .select('*')
    .eq('id', listingId)
    .single()

  if (fetchError) {
    console.error('Error fetching listing:', fetchError)
    throw new Error(`Listing not found: ${fetchError.message}`)
  }

  if (!listing) {
    console.error('No listing found with ID:', listingId)
    throw new Error('Listing not found')
  }

  console.log('Found listing:', listing)
  console.log('Current user ID:', user.id)
  console.log('Listing owner ID:', listing.user_id)

  if (listing.user_id !== user.id) {
    throw new Error('You do not have permission to delete this listing')
  }

  // Delete the listing
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', listingId)

  console.log('Deletion response:', { error })

  if (error) {
    console.error('Error deleting listing:', error)
    throw new Error(`Failed to delete listing: ${error.message}`)
  }

  // Revalidate all pages that show listings
  revalidatePath('/')
  revalidatePath('/my-listings')
  revalidatePath('/listing/[id]', 'page') // Revalidate the specific listing page layout too

  // Redirect to the user's listings page after successful deletion
  redirect('/my-listings')
}