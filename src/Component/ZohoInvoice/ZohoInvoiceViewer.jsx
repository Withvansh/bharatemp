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
        const response = await axios.get(`${backend}/zoho/invoice/order/${orderId}`);
        
        if (response.data?.status === 'Success') {
          setZohoInvoice(response.data.data.zoho_invoice);
        } else {
          setError('Zoho invoice not found for this order');
        }
      } catch (error) {
        console.error('Error fetching Zoho invoice:', error);
        setError('Failed to load Zoho invoice details');
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
      if (!zohoInvoice?.zoho_invoice_id) {
        toast.error('Invoice ID not available');
        return;
      }

      const response = await axios.get(
        `${backend}/zoho/invoice/${zohoInvoice.zoho_invoice_id}/download`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${zohoInvoice.zoho_invoice_number || 'bharatronix'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
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
          {zohoInvoice?.zoho_sync_status === 'success' && (
            <button
              onClick={handleDownloadPDF}
              className="w-full bg-[#1e3473] text-white py-3 px-4 rounded-lg hover:bg-[#162554] transition-colors font-medium"
            >
              📥 Download Professional Invoice (PDF)
            </button>
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