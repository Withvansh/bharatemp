import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../utils/LoadingSpinner';

const backend = import.meta.env.VITE_BACKEND;

const PaymentCallback = () => {
  const { paymentId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasVerified = useRef(false);
  const isVerifying = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      // Prevent multiple verification calls
      if (isVerifying.current || hasVerified.current) {
        return;
      }
      
      isVerifying.current = true;
      hasVerified.current = true;
      
      try {
        const token = localStorage.getItem('token');
        const parsedToken = token?.startsWith('"') ? JSON.parse(token) : token;

        if (!parsedToken) {
          toast.error('Authentication required', { toastId: 'auth-error' });
          navigate('/login');
          return;
        }

        // Get transaction details from URL params
        const code = searchParams.get('code');
        const transactionId = searchParams.get('transactionId') || searchParams.get('transaction_id') || paymentId;
        
        console.log('Payment callback params:', {
          code,
          transactionId,
          paymentId
        });
        
        // Check if payment was cancelled or failed
        if (code === 'PAYMENT_CANCELLED' || code === 'PAYMENT_ERROR') {
          console.log('Payment cancelled/failed, redirecting to cancel page');
          navigate(`/phonepe-payment-cancel/${paymentId}`);
          return;
        }

        // Verify payment with backend
        const verificationData = {
          paymentId: paymentId,
          merchantTransactionId: paymentId
        };
        
        console.log('Verifying payment with data:', verificationData);

        const response = await axios.post(
          `${backend}/payment/verify-phonepe-payment`,
          verificationData,
          {
            headers: {
              Authorization: `Bearer ${parsedToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Payment verification response:', response.data);
        
        if (response.data?.status === 'Success') {
          const verificationResult = response.data.data.response;
          
          if (verificationResult?.success === true || verificationResult?.message?.includes('Successfully')) {
            // Payment successful - redirect to success page
            const orderId = verificationResult.orderId;
            console.log('Payment successful, redirecting to success page with orderId:', orderId);
            
            // Clear any pending payment data
            sessionStorage.removeItem('pendingPayment');
            
            // Redirect to success page
            navigate(`/payment-success/${orderId}`);
          } else {
            // Payment failed - redirect to cancel page
            console.log('Payment verification failed:', verificationResult?.message);
            navigate(`/phonepe-payment-cancel/${paymentId}`);
          }
        } else {
          // Payment verification failed
          console.log('Payment verification API failed');
          navigate(`/phonepe-payment-cancel/${paymentId}`);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        
        // Check if it's a network error or server error
        if (error.response?.status >= 500) {
          toast.error('Server error during payment verification. Please contact support.', { toastId: 'server-error' });
        } else {
          toast.error('Payment verification failed', { toastId: 'verification-error' });
        }
        
        navigate(`/phonepe-payment-cancel/${paymentId}`);
      } finally {
        isVerifying.current = false;
      }
    };

    if (paymentId && !hasVerified.current) {
      verifyPayment();
    } else if (!paymentId && !hasVerified.current) {
      console.log('No payment ID found');
      toast.error('Invalid payment reference', { toastId: 'invalid-payment' });
      navigate('/');
      hasVerified.current = true;
    }
  }, [paymentId, searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner />
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Verifying Payment...</h2>
        <p className="mt-2 text-gray-600">Please wait while we confirm your payment.</p>
        <div className="mt-4 text-sm text-gray-500">
          <p>• Do not refresh this page</p>
          <p>• Do not press the back button</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;