import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../utils/LoadingSpinner';

const backend = import.meta.env.VITE_BACKEND;

const ZohoInvoiceViewer = ({ orderId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [zohoInvoice, setZohoInvoice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchZohoInvoice = async () => {
      try {
        const token = localStorage.getItem('token');
        const parsedToken = token?.startsWith('"') ? JSON.parse(token) : token;
        
        const response = await axios.get(`${backend}/api/v1/user/invoice/order/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${parsedToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data?.status === 'Success') {
          setZohoInvoice(response.data.data.zoho_invoice);
        } else {
          setError(response.data?.data?.message || 'Invoice not found for this order');
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
        if (error.response?.status === 404) {
          setError('Invoice not yet generated for this order. Please try again later.');
        } else if (error.response?.status === 403) {
          setError('Access denied: This is not your order.');
        } else if (error.response?.data?.data?.message) {
          setError(error.response.data.data.message);
        } else {
          setError('Failed to load invoice details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchZohoInvoice();
    }
  }, [orderId]);

  const handleDownloadPDF = async () => {
    try {
      if (!orderId) {
        toast.error('Order ID not available');
        return;
      }

      toast.info('Preparing professional invoice download...');
      
      const token = localStorage.getItem('token');
      const parsedToken = token?.startsWith('"') ? JSON.parse(token) : token;
      
      const response = await axios.get(
        `${backend}/api/v1/user/invoice/download/${orderId}`,
        { 
          responseType: 'blob',
          headers: {
            'Authorization': `Bearer ${parsedToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Check if response is actually a PDF
      if (response.data.type === 'application/pdf' || response.headers['content-type']?.includes('pdf')) {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `bharatronix-invoice-${zohoInvoice?.zoho_invoice_number || orderId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        toast.success('Professional invoice downloaded successfully!');
      } else {
        throw new Error('Invalid file format received');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      if (error.response?.status === 404) {
        toast.error('Invoice not available for download. Please contact support.');
      } else if (error.response?.status === 403) {
        toast.error('Access denied: This is not your order.');
      } else if (error.response?.status === 500) {
        toast.error('Server error while generating PDF. Please try again.');
      } else {
        toast.error('Failed to download invoice. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Loading professional invoice...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Invoice Not Available</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">📄 Professional Invoice</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Invoice Number:</span>
              <p className="font-semibold">{zohoInvoice?.zoho_invoice_number || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <p className="font-semibold capitalize">{zohoInvoice?.zoho_invoice_status || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">✨ Professional Features</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• GST compliant format</li>
            <li>• Company branding</li>
            <li>• Professional PDF</li>
          </ul>
        </div>

        <div className="space-y-3">
          {zohoInvoice?.zoho_sync_status === 'success' ? (
            <button
              onClick={handleDownloadPDF}
              className="w-full bg-[#1e3473] text-white py-3 px-4 rounded-lg hover:bg-[#162554] transition-colors font-medium"
            >
              📥 Download Professional Invoice (PDF)
            </button>
          ) : (
            <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-800 py-3 px-4 rounded-lg text-center">
              📄 Invoice is being generated. Please try again in a few minutes.
            </div>
          )}
          
          <button
            onClick={onClose}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZohoInvoiceViewer;