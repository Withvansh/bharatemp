import React from "react";
import { Link } from "react-router-dom";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

const MobileQuickActions = () => {
  return (
    <>
      {/* Keep existing product links */}
      {/* <div className="md:hidden grid grid-cols-2 gap-3 p-4 bg-white">
        <Link
          to="/allproducts"
          className="flex flex-col items-center justify-center bg-orange-50 rounded-xl py-3 border border-orange-100 hover:shadow-md transition"
        >
          <div className="text-3xl">🛍️</div>
          <h3 className="font-semibold text-sm text-gray-800">All Products</h3>
          <p className="text-xs text-gray-500">Browse catalog</p>
        </Link>

        <Link
          to="/shopbybrand"
          className="flex flex-col items-center justify-center bg-blue-50 rounded-xl py-3 border border-blue-100 hover:shadow-md transition"
        >
          <div className="text-3xl">🏷️</div>
          <h3 className="font-semibold text-sm text-gray-800">Shop by Brand</h3>
          <p className="text-xs text-gray-500">Top brands</p>
        </Link>

        <Link
          to="/b2bpage"
          className="flex flex-col items-center justify-center bg-green-50 rounded-xl py-3 border border-green-100 hover:shadow-md transition"
        >
          <div className="text-3xl">🏢</div>
          <h3 className="font-semibold text-sm text-gray-800">B2B Enquiry</h3>
          <p className="text-xs text-gray-500">Bulk orders</p>
        </Link>

        <Link
          to="/track-order"
          className="flex flex-col items-center justify-center bg-purple-50 rounded-xl py-3 border border-purple-100 hover:shadow-md transition"
        >
          <div className="text-3xl">🚚</div>
          <h3 className="font-semibold text-sm text-gray-800">Track Order</h3>
          <p className="text-xs text-gray-500">Order status</p>
        </Link>
      </div> */}

      {/* Floating Action Buttons for mobile */}
      <div className="md:hidden fixed bottom-20 right-4 flex flex-col gap-3 z-50">
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/919560021660"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform transform hover:scale-110"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp size={22} />
        </a>

        {/* Call Button */}
        <a
          href="tel:+919560021660"
          className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform transform hover:scale-110"
          aria-label="Call Us"
        >
          <FaPhoneAlt size={20} />
        </a>
      </div>
    </>
  );
};

export default MobileQuickActions;
