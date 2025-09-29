import React, { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const PhonePePaymentCancel = () => {
  const { paymentId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const message = searchParams.get('message');
    
    console.log('Payment cancelled:', { code, message, paymentId });
    
    // Clear any pending payment data
    sessionStorage.removeItem('pendingPayment');
    
    // Show appropriate message
    if (code === 'PAYMENT_CANCELLED') {
      toast.error('Payment was cancelled by user');
    } else {
      toast.error(message || 'Payment failed');
    }
  }, [paymentId, searchParams]);

  const handleRetryPayment = () => {
    navigate(-2); // Go back to product page
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. You can try again or continue shopping.
        </p>
        <div className="space-y-3">
          <button
            onClick={handleRetryPayment}
            className="w-full bg-[#1e3473] text-white py-3 px-4 rounded-lg hover:bg-[#162554] transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={handleContinueShopping}
            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhonePePaymentCancel;