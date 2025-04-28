'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createListing(formData: FormData) {
  const supabase = createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.error('Error: User not authenticated to create listing.');
    // Redirect to login or show an error message
    return redirect('/login?message=Please log in to post a membership')
  }

  // Basic validation (more robust validation should be added)
  const rawData = {
    user_id: user.id, // Add user_id
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
    price: Number(formData.get('price') as string),
    contact_info: formData.get('contact_info') as string,
  }

  // Clear location fields if type is Online
  if (rawData.type === 'Online') {
    rawData.country = null;
    rawData.state = null;
    rawData.city = null;
    rawData.address_details = null;
  }

  // TODO: Add more robust validation here (e.g., using Zod)

  const { error } = await supabase.from('listings').insert([rawData]);

  if (error) {
    console.error('Supabase insert error:', error);
    // Consider returning an error message to the form
    // For now, redirecting back to the form with an error query param
    return redirect('/post-membership?error=' + encodeURIComponent(error.message));
  }

  // Revalidate the home page to show the new listing
  revalidatePath('/')

  // Redirect to home page after successful submission
  redirect('/?message=Listing posted successfully!')
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

  // Explicitly return the success object
  return { success: true }
}