import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FaTimes, FaArrowLeft, FaShoppingCart, FaHome } from 'react-icons/fa';

const PaymentCancelled = () => {
    const { orderId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const paymentId = searchParams.get('paymentId');
    const amount = searchParams.get('amount');
    const reason = searchParams.get('reason') || 'Payment was cancelled by user';

    useEffect(() => {
        // Fetch order details if orderId is available
        if (orderId) {
            fetchOrderDetails();
        } else {
            setLoading(false);
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            // Add your API call here to fetch order details
            // const response = await fetch(`/api/orders/${orderId}`);
            // const data = await response.json();
            // setOrderDetails(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching order details:', error);
            setLoading(false);
        }
    };

    const handleRetryPayment = () => {
        if (orderId) {
            navigate(`/checkout?orderId=${orderId}`);
        } else {
            navigate('/cart');
        }
    };

    const handleBackToCart = () => {
        navigate('/cart');
    };

    const handleContinueShopping = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    {/* Cancellation Icon */}
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
                        <FaTimes className="h-12 w-12 text-red-600" />
                    </div>
                    
                    {/* Main Message */}
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Payment Cancelled
                    </h2>
                    
                    <p className="text-lg text-gray-600 mb-6">
                        Your payment has been cancelled successfully. No amount has been charged.
                    </p>
                    
                    {/* Order Details */}
                    {(orderId || paymentId || amount) && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 text-left">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h3>
                            <div className="space-y-2 text-sm">
                                {orderId && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Order ID:</span>
                                        <span className="font-medium text-gray-900">{orderId}</span>
                                    </div>
                                )}
                                {paymentId && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Payment ID:</span>
                                        <span className="font-medium text-gray-900">{paymentId}</span>
                                    </div>
                                )}
                                {amount && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Amount:</span>
                                        <span className="font-medium text-gray-900">₹{amount}</span>
                                    </div>
                                )}
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
                    )}
                    
                    {/* Action Buttons */}
                    <div className="space-y-4">
                        {orderId && (
                            <button
                                onClick={handleRetryPayment}
                                className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <FaArrowLeft className="h-5 w-5 mr-2" />
                                Try Payment Again
                            </button>
                        )}
                        
                        <button
                            onClick={handleBackToCart}
                            className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <FaShoppingCart className="h-5 w-5 mr-2" />
                            Back to Cart
                        </button>
                        
                        <button
                            onClick={handleContinueShopping}
                            className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <FaHome className="h-5 w-5 mr-2" />
                            Continue Shopping
                        </button>
                    </div>
                    
                    {/* Help Text */}
                    <div className="mt-8 text-sm text-gray-500">
                        <p>Need help? Contact our support team at</p>
                        <a 
                            href="mailto:support@bharatronix.com" 
                            className="text-blue-600 hover:text-blue-500 font-medium"
                        >
                            support@bharatronix.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancelled;