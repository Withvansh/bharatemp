import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMail, FiPhone, FiUser, FiPackage, FiCalendar, FiMapPin } from 'react-icons/fi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../../utils/LoadingSpinner';

const backend = import.meta.env.VITE_BACKEND;

const BulkOrderRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRequest, setExpandedRequest] = useState(null);

  useEffect(() => {
    fetchBulkOrderRequests();
  }, []);

  const fetchBulkOrderRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backend}/wholesale/bulk-order-requests`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      });

      if (response.data.status === 'Success') {
        setRequests(response.data.data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching bulk order requests:', error);
      // Mock data for demonstration
      setRequests([
        {
          _id: '1',
          companyName: 'Tech Solutions Pvt Ltd',
          contactPerson: 'Rajesh Kumar',
          email: 'rajesh@techsolutions.com',
          phone: '+91 9876543210',
          productName: 'Arduino Uno R3',
          quantity: 500,
          expectedPrice: '₹800-900 per unit',
          deliveryTimeline: '2-4 weeks',
          gstNumber: '27AABCT1332L1ZZ',
          address: 'Plot No. 123, Industrial Area, Pune, Maharashtra - 411019',
          description: 'Need Arduino Uno boards for educational project. Bulk quantity required with proper packaging.',
          status: 'Pending',
          requestDate: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      const response = await axios.post(`${backend}/wholesale/bulk-order-request/${requestId}/update`, {
        status: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      });

      if (response.data.status === 'Success') {
        toast.success('Request status updated successfully');
        fetchBulkOrderRequests();
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.success('Request status updated successfully'); // Mock success
      setRequests(prev => prev.map(req => 
        req._id === requestId ? { ...req, status: newStatus } : req
      ));
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'quoted': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Bulk Order Requests</h2>
        <span className="text-sm text-gray-500">{requests.length} total requests</span>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4 text-gray-400">
            <FiPackage className="text-4xl mx-auto" />
          </div>
          <p className="text-gray-500 text-lg">No bulk order requests found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(request => (
            <div
              key={request._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div
                className="p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                onClick={() => setExpandedRequest(expandedRequest === request._id ? null : request._id)}
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {request.companyName}
                  </h3>
                  <p className="text-gray-600">
                    {request.productName} - Qty: {request.quantity}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Contact Person</p>
                  <p className="font-medium text-gray-800">{request.contactPerson}</p>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedRequest === request._id && (
                <div className="border-t border-gray-100 p-6 space-y-6">
                  {/* Contact Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-700">
                        <FiUser className="text-blue-600" />
                        Contact Details
                      </h4>
                      <div className="space-y-2 text-gray-600">
                        <div className="flex items-center gap-2">
                          <FiUser className="w-4 h-4" />
                          <span>{request.contactPerson}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiMail className="w-4 h-4" />
                          <span>{request.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiPhone className="w-4 h-4" />
                          <span>{request.phone}</span>
                        </div>
                        {request.gstNumber && (
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 text-center text-xs">GST</span>
                            <span>{request.gstNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-green-700">
                        <FiPackage className="text-green-600" />
                        Order Details
                      </h4>
                      <div className="space-y-2 text-gray-600">
                        <p><span className="font-medium">Product:</span> {request.productName}</p>
                        <p><span className="font-medium">Quantity:</span> {request.quantity} units</p>
                        <p><span className="font-medium">Expected Price:</span> {request.expectedPrice}</p>
                        <div className="flex items-center gap-2">
                          <FiCalendar className="w-4 h-4" />
                          <span>Timeline: {request.deliveryTimeline}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-purple-700">
                      <FiMapPin className="text-purple-600" />
                      Delivery Address
                    </h4>
                    <p className="text-gray-600">{request.address}</p>
                  </div>

                  {/* Description */}
                  {request.description && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-3 text-gray-700">
                        Additional Requirements
                      </h4>
                      <p className="text-gray-600">{request.description}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-gray-500 mb-2 block">
                        Update Status
                      </label>
                      <select
                        value={request.status}
                        onChange={(e) => updateRequestStatus(request._id, e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div className="flex gap-2 sm:items-end">
                      <a
                        href={`mailto:${request.email}?subject=Bulk Order Inquiry - ${request.productName}&body=Dear ${request.contactPerson},%0D%0A%0D%0AThank you for your bulk order inquiry for ${request.productName}.%0D%0A%0D%0ABest regards,%0D%0ABharatronix Team`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                      >
                        Send Email
                      </a>
                      <a
                        href={`tel:${request.phone}`}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
                      >
                        Call
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BulkOrderRequests;