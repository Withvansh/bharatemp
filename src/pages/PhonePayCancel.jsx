import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FaTimes, FaArrowLeft, FaShoppingCart, FaHome } from 'react-icons/fa';

const PhonePayCancel = () => {
    const { paymentId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const transactionId = searchParams.get('transactionId') || searchParams.get('transaction_id');
    const merchantTransactionId = searchParams.get('merchantTransactionId') || paymentId;
    const amount = searchParams.get('amount');
    const reason = searchParams.get('reason') || 'Payment cancelled by user';

    useEffect(() => {
        // Log the cancellation for analytics
        console.log('PhonePe payment cancelled:', {
            paymentId,
            transactionId,
            merchantTransactionId,
            reason
        });
    }, [paymentId, transactionId, merchantTransactionId, reason]);

    const handleRetryPayment = () => {
        navigate('/cart');
    };

    const handleBackToProducts = () => {
        navigate('/allproducts');
    };

    const handleContinueShopping = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    {/* PhonePe Cancellation Icon */}
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
                        <FaTimes className="h-12 w-12 text-red-600" />
                    </div>
                    
                    {/* Main Message */}
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        PhonePe Payment Cancelled
                    </h2>
                    
                    <p className="text-lg text-gray-600 mb-6">
                        Your PhonePe payment has been cancelled. No amount has been charged to your account.
                    </p>
                    
                    {/* Transaction Details */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 text-left">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h3>
                        <div className="space-y-2 text-sm">
                            {merchantTransactionId && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment ID:</span>
                                    <span className="font-medium text-gray-900">{merchantTransactionId}</span>
                                </div>
                            )}
                            {transactionId && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Transaction ID:</span>
                                    <span className="font-medium text-gray-900">{transactionId}</span>
                                </div>
                            )}
                            {amount && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Amount:</span>
                                    <span className="font-medium text-gray-900">₹{amount}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Payment Method:</span>
                                <span className="font-medium text-gray-900">PhonePe</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className="font-medium text-red-600">Cancelled</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Reason:</span>
                                <span className="font-medium text-gray-900">{reason}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <button
                            onClick={handleRetryPayment}
                            className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#1e3473] hover:bg-[#162554] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e3473] transition-colors"
                        >
                            <FaArrowLeft className="h-5 w-5 mr-2" />
                            Try Payment Again
                        </button>
                        
                        <button
                            onClick={handleBackToProducts}
                            className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e3473] transition-colors"
                        >
                            <FaShoppingCart className="h-5 w-5 mr-2" />
                            Browse Products
                        </button>
                        
                        <button
                            onClick={handleContinueShopping}
                            className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e3473] transition-colors"
                        >
                            <FaHome className="h-5 w-5 mr-2" />
                            Continue Shopping
                        </button>
                    </div>
                    
                    {/* Help Text */}
                    <div className="mt-8 text-sm text-gray-500">
                        <p>Need help with your payment? Contact our support team</p>
                        <a 
                            href="mailto:support@bharatronix.com" 
                            className="text-[#1e3473] hover:text-[#162554] font-medium"
                        >
                            support@bharatronix.com
                        </a>
                        <p className="mt-2">or call us at <span className="font-medium">+91-XXXXXXXXXX</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhonePayCancel;