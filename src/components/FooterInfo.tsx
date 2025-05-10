'use client';

import { useState } from 'react';
import InfoModal from './InfoModal';

export default function FooterInfo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  }>({ title: '', content: null });

  const openTermsModal = () => {
    setModalContent({
      title: 'Terms of Service',
      content: (
        <div className="space-y-4">
          <p>
            Welcome to MemberShift. By using our platform, you agree to these Terms of Service.
          </p>
          <h4 className="font-semibold text-gray-800">1. User Accounts</h4>
          <p>
            Users must register with accurate information to sell memberships. Buyers can browse without an account but need to register to complete purchases.
          </p>
          <h4 className="font-semibold text-gray-800">2. Listings</h4>
          <p>
            Sellers are responsible for accurate descriptions of memberships. MemberShift reserves the right to remove listings that violate our policies.
          </p>
          <h4 className="font-semibold text-gray-800">3. Platform Role</h4>
          <p>
            MemberShift only displays listings and stores seller emails. We do not facilitate transactions between buyers and sellers. Buyers contact sellers directly.
          </p>
          <h4 className="font-semibold text-gray-800">4. Liability</h4>
          <p>
            MemberShift is not responsible for any information posted by sellers or any transactions that occur between users.
          </p>
          <h4 className="font-semibold text-gray-800">5. Prohibited Items</h4>
          <p>
            Memberships that cannot legally be transferred or that violate the terms of the original provider are prohibited.
          </p>
        </div>
      ),
    });
    setIsModalOpen(true);
  };

  const openHelpModal = () => {
    setModalContent({
      title: 'Help & Information',
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">About MemberShift</h4>
          <p>
            MemberShift is a platform that displays listings for memberships and subscriptions. We simply show posts from different sellers and do not facilitate transactions.
          </p>
          
          <h4 className="font-semibold text-gray-800">For Buyers:</h4>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Browse listings on the homepage</li>
            <li>Use filters to narrow down by type, category, or location</li>
            <li>Click on a listing to view details</li>
            <li>Contact the seller directly through the contact information on the listing page</li>
          </ol>
          
          <h4 className="font-semibold text-gray-800">For Sellers:</h4>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Create an account or log in</li>
            <li>Click "Post Membership" in the navigation bar</li>
            <li>Fill out the listing form with accurate details</li>
            <li>Submit your listing</li>
            <li>Manage your listings from the "My Listings" page</li>
          </ol>
          
          <h4 className="font-semibold text-gray-800">Important Note</h4>
          <p>
            MemberShift only stores seller email addresses and displays listings. We are not responsible for the accuracy of information or any transactions between users.
          </p>
        </div>
      ),
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex space-x-6">
        <button onClick={openTermsModal} className="text-gray-500 hover:text-blue-500 transition-colors">Terms</button>
        <button onClick={openHelpModal} className="text-gray-500 hover:text-blue-500 transition-colors">Help</button>
      </div>
      <InfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
        content={modalContent.content}
      />
    </>
  );
}
