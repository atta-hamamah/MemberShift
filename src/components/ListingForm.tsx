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
      className="w-full flex justify-center items-center px-4 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.01] shadow-md hover:shadow-lg font-medium"
    >
      {pending ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {pendingText}
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {text}
        </>
      )}
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
  const [contactType, setContactType] = useState('both');
  
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
    <form action={formAction} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
      {/* Form Header */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {initialData.id ? 'Edit Listing' : 'Create New Listing'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Fill out the details below to {initialData.id ? 'update your' : 'create a new'} membership listing
        </p>
      </div>
      {/* Display general form message/error from state */}
      {state.message && !state.errors && (
        <div className={`p-3 mb-4 text-sm rounded-lg border ${state.success ? 'text-green-700 bg-green-100 border-green-300' : 'text-red-700 bg-red-100 border-red-300'}`}>
          {state.success ? 'Success:' : 'Error:'} {state.message}
        </div>
      )}

      {/* Basic Information - Horizontal Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Type Selection */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Membership Type</label>
            <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">Required</span>
          </div>
          <select
            id="type"
            name="type"
            required
            value={type} // Controlled component
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-300"
          >
            <option value="Online">Online</option>
            <option value="Physical">Physical</option>
          </select>
          {displayFieldError('type')}
        </div>
        
        {/* Category */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">Required</span>
          </div>
          <select
            id="category"
            name="category"
            required
            defaultValue={initialData.category ?? ''}
            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-300"
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
      </div>

      {/* Conditional Location Fields */}
      {type === 'Physical' && (
        <div className="space-y-4 p-5 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-white shadow-sm">
          <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Location Details
          </h3>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
              <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">Required</span>
            </div>
            <input 
              type="text" 
              id="country" 
              name="country" 
              required={type === 'Physical'} 
              defaultValue={initialData.country ?? ''} 
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-300" 
              placeholder="Enter country"
            />
             {displayFieldError('country')}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">State/Province</label>
              <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">Required</span>
            </div>
            <input 
              type="text" 
              id="state" 
              name="state" 
              required={type === 'Physical'} 
              defaultValue={initialData.state ?? ''} 
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-300" 
              placeholder="Enter state or province"
            />
             {displayFieldError('state')}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">Required</span>
            </div>
            <input 
              type="text" 
              id="city" 
              name="city" 
              required={type === 'Physical'} 
              defaultValue={initialData.city ?? ''} 
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-300" 
              placeholder="Enter city"
            />
             {displayFieldError('city')}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="address_details" className="block text-sm font-medium text-gray-700">Address Details</label>
              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">Optional</span>
            </div>
            <textarea 
              id="address_details" 
              name="address_details" 
              rows={2} 
              defaultValue={initialData.address_details ?? ''} 
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-300"
              placeholder="Additional address information (optional)"
            ></textarea>
             {displayFieldError('address_details')}
          </div>
        </div>
      )}

      {/* Title and Description */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">Required</span>
        </div>
        <input 
          type="text" 
          id="title" 
          name="title" 
          required 
          maxLength={100} 
          defaultValue={initialData.title ?? ''} 
          className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-300" 
          placeholder="Enter a descriptive title for your listing"
        />
        {displayFieldError('title')}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">Required</span>
        </div>
        <textarea 
          id="description" 
          name="description" 
          required 
          rows={4} 
          maxLength={500} 
          defaultValue={initialData.description ?? ''} 
          className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-300"
          placeholder="Provide a detailed description of the membership or subscription..."
        ></textarea>
        <p className="mt-1 text-xs text-gray-500">Describe the benefits, features, and any special conditions. <span className="text-blue-600">{500 - (initialData.description?.length || 0)} characters remaining</span></p>
        {displayFieldError('description')}
      </div>

      {/* Condition and Price - Horizontal Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Condition */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
            <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">Required</span>
          </div>
          <select
            id="condition"
            name="condition"
            required
            defaultValue={initialData.condition ?? 'New'} // Default to 'New' if not provided
            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-300"
          >
            <option value="New">New</option>
            <option value="Partially Used">Partially Used</option>
          </select>
          {displayFieldError('condition')}
        </div>
        
        {/* Price */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
            <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">Required</span>
          </div>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input 
              type="number" 
              id="price" 
              name="price" 
              required 
              min="0" 
              step="0.01" 
              defaultValue={initialData.price ?? ''} 
              className="mt-1 block w-full pl-7 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-300" 
              placeholder="0.00"
            />
          </div>
          {displayFieldError('price')}
        </div>
      </div>

      {/* Dates (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date</label>
            <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">Optional</span>
          </div>
          <input 
            type="date" 
            id="start_date" 
            name="start_date" 
            defaultValue={formatDateForInput(initialData.start_date)} 
            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-300" 
          />
           {displayFieldError('start_date')}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">End Date</label>
            <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">Optional</span>
          </div>
          <input 
            type="date" 
            id="end_date" 
            name="end_date" 
            defaultValue={formatDateForInput(initialData.end_date)} 
            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-300" 
          />
           {displayFieldError('end_date')}
        </div>
      </div>

      {/* Contact Options */}
      <div className="space-y-4 p-5 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-white shadow-sm">
        <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          Contact Options
        </h3>
        
        {/* Contact Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Preference *</label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="contact_type" 
                value="email_only" 
                checked={contactType === 'email_only'} 
                onChange={() => setContactType('email_only')} 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Email Only</span>
            </label>
            
            <label className="flex items-center">
              <input 
                type="radio" 
                name="contact_type" 
                value="other_only" 
                checked={contactType === 'other_only'} 
                onChange={() => setContactType('other_only')} 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Other Contact Method</span>
            </label>
            
            <label className="flex items-center">
              <input 
                type="radio" 
                name="contact_type" 
                value="both" 
                checked={contactType === 'both'} 
                onChange={() => setContactType('both')} 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Email & Other Method</span>
              <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Recommended</span>
            </label>
          </div>
        </div>
        
        {/* Hidden field to store the contact type */}
        <input type="hidden" name="contact_type" value={contactType} />
        
        {/* Email note - always visible but just as information */}
        <div>
          <p className="text-sm text-gray-600">
            {contactType === 'email_only' 
              ? 'Buyers will contact you via your registered email address.' 
              : contactType === 'both' 
                ? 'Buyers will be able to contact you via your registered email and the additional contact method below.' 
                : 'Buyers will only use the contact method you provide below.'}
          </p>
          
          {contactType === 'both' && (
            <p className="mt-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-md">
              <strong>Why this is recommended:</strong> Providing multiple contact options increases your chances of connecting with potential buyers. Some buyers may prefer email while others might prefer alternative methods like phone or messaging apps.
            </p>
          )}
        </div>
        
        {/* Additional Contact Method */}
        {(contactType === 'other_only' || contactType === 'both') && (
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700">Additional Contact Method</label>
              <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">Required</span>
            </div>
            <textarea 
              id="contact_info" 
              name="contact_info" 
              rows={2} 
              required={contactType === 'other_only' || contactType === 'both'} 
              maxLength={200} 
              defaultValue={initialData.contact_info ?? ''} 
              placeholder="Phone number, WhatsApp, Telegram, etc."
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-300"
            ></textarea>
            <p className="mt-1 text-xs text-gray-500">This information will be publicly visible to potential buyers.</p>
            {displayFieldError('contact_info')}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <SubmitButton text={submitButtonText} pendingText={pendingSubmitButtonText} />

    </form>
  )
} 