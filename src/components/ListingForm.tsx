'use client'

import { useState, useEffect } from 'react'
// Removed direct import of createListing
// import { createListing } from '../app/post-membership/actions'
import { useSearchParams } from 'next/navigation'
import { type z } from 'zod';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom'; // Import form hooks

// Define a type for the expected listing data structure (adjust based on your actual schema)
type ListingData = {
  id?: string;
  title?: string;
  price?: number;
  type?: string;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  address_details?: string | null;
  category?: string;
  description?: string | null;
  condition?: string;
  start_date?: string | null; // Assuming date strings
  end_date?: string | null; // Assuming date strings
  contact_info?: string;
  // Add other fields as necessary
};

// Updated ServerActionResult type to match useFormState expectations
type FormState = {
    success: boolean;
    message?: string | null;
    errors?: Record<string, string[] | undefined> | null; 
};

// Type for the action prop
type FormAction = (prevState: FormState, formData: FormData) => Promise<FormState>;

// Submit Button Component using useFormStatus
function SubmitButton({ text, pendingText }: { text: string, pendingText: string }) {
  // useFormStatus must be used within a <form>
  const { pending } = useFormStatus(); 

  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? pendingText : text}
    </button>
  )
}

interface ListingFormProps {
  initialData?: ListingData;
  // Action needs to conform to useFormState signature: (prevState, formData) => newState
  action: FormAction; 
  submitButtonText?: string;
  pendingSubmitButtonText?: string;
}

// Define initial state for the form
const initialState: FormState = {
    success: false,
    message: null,
    errors: null
};

export default function ListingForm({
  initialData = {},
  action,
  submitButtonText = 'Submit',
  pendingSubmitButtonText = 'Submitting...'
}: ListingFormProps) {
  const [type, setType] = useState(initialData.type || 'Online'); 
  
  // Use useActionState instead of useFormState
  const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    if (initialData.type) {
      setType(initialData.type);
    }
  }, [initialData.type]);

  // Format date for input type="date"
  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch (e) {
      console.error("Error formatting date:", e);
      return ''; // Handle invalid date string gracefully
    }
  };

  // Update displayFieldError to use the state from useFormState
  const displayFieldError = (fieldName: string) => {
    const errorsForField = state.errors?.[fieldName];
    return Array.isArray(errorsForField) && errorsForField.length > 0 ? (
        <p className="mt-1 text-xs text-red-600">{errorsForField.join(', ')}</p>
    ) : null;
  }

  return (
    // Pass the formAction dispatcher from useActionState to the form
    <form action={formAction} className="space-y-6 bg-white p-8 rounded-lg shadow-md border">
      {/* Display general form message/error from state */}
      {state.message && !state.errors && (
        <div className={`p-3 mb-4 text-sm rounded-lg border ${state.success ? 'text-green-700 bg-green-100 border-green-300' : 'text-red-700 bg-red-100 border-red-300'}`}>
          {state.success ? 'Success:' : 'Error:'} {state.message}
        </div>
      )}

      {/* Type Selection */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Membership Type *</label>
        <select
          id="type"
          name="type"
          required
          value={type} // Controlled component
          onChange={(e) => setType(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="Online">Online</option>
          <option value="Physical">Physical</option>
        </select>
        {displayFieldError('type')}
      </div>

      {/* Conditional Location Fields */}
      {type === 'Physical' && (
        <div className="space-y-4 p-4 border border-gray-200 rounded-md bg-gray-50">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Location Details (for Physical)</h3>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country *</label>
            <input type="text" id="country" name="country" required={type === 'Physical'} defaultValue={initialData.country ?? ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
             {displayFieldError('country')}
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State/Province *</label>
            <input type="text" id="state" name="state" required={type === 'Physical'} defaultValue={initialData.state ?? ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
             {displayFieldError('state')}
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City *</label>
            <input type="text" id="city" name="city" required={type === 'Physical'} defaultValue={initialData.city ?? ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
             {displayFieldError('city')}
          </div>
          <div>
            <label htmlFor="address_details" className="block text-sm font-medium text-gray-700">Address Details</label>
            <textarea id="address_details" name="address_details" rows={2} defaultValue={initialData.address_details ?? ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
             {displayFieldError('address_details')}
          </div>
        </div>
      )}

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category *</label>
        <select
          id="category"
          name="category"
          required
          defaultValue={initialData.category ?? ''}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="" disabled>Select Category</option>
          <option value="Gym">Gym</option>
          <option value="Streaming">Streaming Service</option>
          <option value="Software">Software/SaaS</option>
          <option value="Course">Online Course</option>
          <option value="Club">Club/Association</option>
          <option value="Subscription Box">Subscription Box</option>
          <option value="Other">Other</option>
        </select>
        {displayFieldError('category')}
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title *</label>
        <input type="text" id="title" name="title" required maxLength={100} defaultValue={initialData.title ?? ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        {displayFieldError('title')}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" name="description" rows={4} maxLength={500} defaultValue={initialData.description ?? ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        {displayFieldError('description')}
      </div>

      {/* Condition */}
      <div>
        <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition *</label>
        <select
          id="condition"
          name="condition"
          required
          defaultValue={initialData.condition ?? 'New'} // Default to 'New' if not provided
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="New">New</option>
          <option value="Partially Used">Partially Used</option>
        </select>
        {displayFieldError('condition')}
      </div>

      {/* Dates (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date (Optional)</label>
          <input type="date" id="start_date" name="start_date" defaultValue={formatDateForInput(initialData.start_date)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
           {displayFieldError('start_date')}
        </div>
        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">End Date (Optional)</label>
          <input type="date" id="end_date" name="end_date" defaultValue={formatDateForInput(initialData.end_date)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
           {displayFieldError('end_date')}
        </div>
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($) *</label>
        <input type="number" id="price" name="price" required min="0" step="0.01" defaultValue={initialData.price ?? ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        {displayFieldError('price')}
      </div>

      {/* Contact Info */}
      <div>
        <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700">Contact Information *</label>
        <textarea id="contact_info" name="contact_info" rows={2} required maxLength={200} defaultValue={initialData.contact_info ?? ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        <p className="mt-1 text-xs text-gray-500">Provide email, phone number, or other preferred contact method. This will be publicly visible.</p>
        {displayFieldError('contact_info')}
      </div>

      {/* Submit Button */}
      <SubmitButton text={submitButtonText} pendingText={pendingSubmitButtonText} />

    </form>
  )
} 