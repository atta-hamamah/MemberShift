'use client'

import { useState, useTransition } from 'react'
import { createListing } from '../app/post-membership/actions'
import { useSearchParams } from 'next/navigation'

// Simple Submit Button component to show pending state
function SubmitButton() {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="submit"
      aria-disabled={isPending}
      disabled={isPending}
      className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? 'Posting...' : 'Post Membership'}
    </button>
  )
}

export default function PostMembershipForm() {
  const [type, setType] = useState('Online'); // Default to Online
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const formError = searchParams.get('error'); // Get error from URL if redirect happened

  const handleFormSubmit = async (formData: FormData) => {
    startTransition(async () => {
        await createListing(formData);
        // Redirect or error handling is done within the server action
    });
  };

  return (
    <form action={handleFormSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md border">
      {formError && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
          <strong>Error:</strong> {formError}
        </div>
      )}

      {/* Type Selection */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Membership Type *</label>
        <select
          id="type"
          name="type"
          required
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="Online">Online</option>
          <option value="Physical">Physical</option>
        </select>
      </div>

      {/* Conditional Location Fields */}
      {type === 'Physical' && (
        <div className="space-y-4 p-4 border border-gray-200 rounded-md bg-gray-50">
           <h3 className="text-lg font-medium leading-6 text-gray-900">Location Details (for Physical)</h3>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country *</label>
            <input type="text" id="country" name="country" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State/Province *</label>
            <input type="text" id="state" name="state" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City *</label>
            <input type="text" id="city" name="city" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="address_details" className="block text-sm font-medium text-gray-700">Address Details</label>
            <textarea id="address_details" name="address_details" rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
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
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Select Category</option>
          <option value="Gym">Gym</option>
          <option value="Streaming">Streaming Service</option>
          <option value="Software">Software/SaaS</option>
          <option value="Course">Online Course</option>
          <option value="Club">Club/Association</option>
          <option value="Subscription Box">Subscription Box</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title *</label>
        <input type="text" id="title" name="title" required maxLength={100} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" name="description" rows={4} maxLength={500} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
      </div>

       {/* Condition */}
      <div>
        <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition *</label>
        <select
          id="condition"
          name="condition"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="New">New</option>
          <option value="Partially Used">Partially Used</option>
        </select>
      </div>

      {/* Dates (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date (Optional)</label>
          <input type="date" id="start_date" name="start_date" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">End Date (Optional)</label>
          <input type="date" id="end_date" name="end_date" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($) *</label>
        <input type="number" id="price" name="price" required min="0" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
      </div>

      {/* Contact Info */}
      <div>
        <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700">Contact Information *</label>
        <textarea id="contact_info" name="contact_info" rows={2} required maxLength={200} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        <p className="mt-1 text-xs text-gray-500">Provide email, phone number, or other preferred contact method. This will be publicly visible.</p>
      </div>

      {/* Submit Button */}
      <SubmitButton />

    </form>
  )
} 