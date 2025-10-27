import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../utils/LoadingSpinner';
import ZohoInvoiceViewer from '../Component/ZohoInvoice/ZohoInvoiceViewer';
import '../styles/mobile-responsive.css';

const backend = import.meta.env.VITE_BACKEND;

const PaymentSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);
  const [showZohoInvoice, setShowZohoInvoice] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!orderId) {
          setError('Order ID not found');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${backend}/order/${orderId}`);
        
        if (response.data?.status === 'Success' && response.data?.data?.order) {
          setOrderData(response.data.data.order);
          toast.success('Payment completed successfully!', { toastId: 'payment-success' });
        } else {
          setError('Order details not found');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details');
        toast.error('Failed to load order details', { toastId: 'order-error' });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/profile');
  };

  const handleDownloadInvoice = () => {
    // Show Zoho invoice viewer
    setShowZohoInvoice(true);
  };
  
  const handleViewProfessionalInvoice = () => {
    setShowZohoInvoice(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleContinueShopping}
            className="w-full bg-[#1e3473] text-white py-3 px-4 rounded-lg hover:bg-[#162554] transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 mobile-success-container">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6 md:p-8 mobile-success-card">
        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center mobile-success-icon">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 mobile-success-title">Payment Successful! 🎉</h1>
          <p className="text-gray-600">
            Thank you for your order. Your payment has been processed successfully.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">#{orderData?._id?.slice(-8)?.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium text-green-600">₹{orderData?.totalPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">PhonePe</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-blue-600">{orderData?.status || 'Processing'}</span>
            </div>
            {orderData?.expected_delivery_date && (
              <div className="flex justify-between">
                <span className="text-gray-600">Expected Delivery:</span>
                <span className="font-medium">
                  {new Date(orderData.expected_delivery_date).toLocaleDateString('en-IN')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Products Summary */}
        {orderData?.products && orderData.products.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Items Ordered</h3>
            <div className="space-y-3">
              {orderData.products.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {item.product_id?.product_image_main && (
                    <img 
                      src={item.product_id.product_image_main} 
                      alt={item.product_id?.product_name || 'Product'} 
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">
                      {item.product_id?.product_name || item.product_name || 'Product'}
                    </h4>
                    <p className="text-xs text-gray-600">
                      Qty: {item.quantity} × ₹{item.product_price || item.product_id?.discounted_single_product_price || 0}
                    </p>
                  </div>
                </div>
              ))}
              {orderData.products.length > 3 && (
                <p className="text-sm text-gray-600 text-center">
                  +{orderData.products.length - 3} more items
                </p>
              )}
            </div>
          </div>
        )}

        {/* Delivery Information */}
        {orderData?.shippingAddress && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Delivery Information</h3>
            <p className="text-sm text-gray-600">{orderData.shippingAddress}</p>
            {orderData.city && orderData.pincode && (
              <p className="text-sm text-gray-600">
                {orderData.city} - {orderData.pincode}
              </p>
            )}
          </div>
        )}

        {/* Professional Invoice Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">📄 Professional Invoice Ready!</h3>
              <p className="text-sm text-blue-700">GST compliant invoice with company branding</p>
            </div>
          </div>
          <button
            onClick={handleViewProfessionalInvoice}
            className="w-full bg-blue-600 text-white py-3 md:py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium mobile-success-btn"
          >
            View & Download Professional Invoice
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mobile-success-buttons">
          <button
            onClick={handleViewOrders}
            className="w-full bg-[#1e3473] text-white py-4 md:py-3 px-4 rounded-lg hover:bg-[#162554] transition-colors font-medium mobile-success-btn"
          >
            View My Orders
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownloadInvoice}
              className="bg-gray-200 text-gray-800 py-3 md:py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm mobile-success-btn"
            >
              Download Invoice
            </button>
            <button
              onClick={handleContinueShopping}
              className="bg-gray-200 text-gray-800 py-3 md:py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm mobile-success-btn"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Support Information */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:support@bharatronix.com" className="text-blue-600 hover:underline">
              support@bharatronix.com
            </a>
          </p>
        </div>
      </div>
      
      {/* Zoho Invoice Viewer Modal */}
      {showZohoInvoice && (
        <ZohoInvoiceViewer 
          orderId={orderId} 
          onClose={() => setShowZohoInvoice(false)} 
        />
      )}
    </div>
  );
};

export default PaymentSuccess;