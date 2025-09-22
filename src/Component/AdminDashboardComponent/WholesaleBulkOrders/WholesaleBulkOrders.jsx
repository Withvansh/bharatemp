import axios from 'axios';
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../../utils/LoadingSpinner';
import { convertUTCtoIST2 } from '../../../utils/TimeConverter';
import { FiChevronDown, FiBox, FiMapPin, FiUser, FiDollarSign, FiPackage, FiPhone, FiMail } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAdminRouteProtection } from '../../../utils/AuthUtils';
import UnauthorizedPopup from '../../../utils/UnAuthorizedPopup';

const backend = import.meta.env.VITE_BACKEND;

const WholesaleBulkOrders = () => {
    const [bulkOrders, setBulkOrders] = useState([]);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { showPopup, closePopup, isAuthorized } = useAdminRouteProtection(["SuperAdmin"]);

    // Fetch bulk orders from regular orders API
    const fetchBulkOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get(`${backend}/orders`, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            
            if (response.data && response.data.status === 'Success' && response.data.data && response.data.data.orderList) {
                // Filter orders that contain bulk items
                const ordersWithBulkItems = response.data.data.orderList.filter(order => 
                    order.products && order.products.some(product => product.is_bulk_order === true)
                );
                setBulkOrders(ordersWithBulkItems);
            } else {
                setBulkOrders([]);
            }
        } catch (err) {
            if (err.response?.status === 500) {
                setError('Server error - please try again later');
            } else if (err.response?.status === 401) {
                setError('Unauthorized - please login again');
            } else {
                setError('Failed to fetch bulk orders');
            }
            setBulkOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBulkOrders();
    }, []);

    // Update order status
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await axios.post(`${backend}/order/${orderId}/update-status`, {
                status: newStatus
            }, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            
            if (response.data.status === 'Success') {
                toast.success('Order status updated successfully');
                fetchBulkOrders();
            }
        } catch (error) {
            toast.error('Failed to update order status');
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (!isAuthorized) {
        return showPopup ? <UnauthorizedPopup onClose={closePopup} /> : null;
    }

    return (
        <div className="container mx-auto px-4 py-8 pt-14 bg-gradient-to-b from-gray-50 to-blue-50">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-xl md:text-4xl font-bold mb-8 text-gray-800 flex items-center gap-3">
                    <FiPackage className="text-indigo-600" />
                    Bulk Orders Management
                </h1>

                {loading && <LoadingSpinner />}

                {!loading && error && (
                    <div className="bg-red-50 p-6 rounded-lg flex items-center gap-4 mb-8">
                        <div className="text-red-600">
                            <FiBox className="text-2xl" />
                        </div>
                        <div>
                            <p className="text-red-600 font-medium">{error}</p>
                            <p className="text-red-500 text-sm mt-1">The order system may be temporarily unavailable.</p>
                            <button
                                onClick={fetchBulkOrders}
                                className="mt-2 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {bulkOrders.map(order => (
                        <div
                            key={order._id}
                            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                        >
                            <div
                                className="p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                            >
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                            {order.status || 'Pending'}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Order ID: {order._id.slice(-6).toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg sm:text-xl flex flex-col sm:flex-row font-semibold text-gray-800 sm:items-center gap-2">
                                        {order.name || 'Customer'}
                                        <span className="text-gray-400 hidden sm:inline">•</span>
                                        <span className="text-gray-500 text-sm font-normal">
                                            {convertUTCtoIST2(order.created_at)}
                                        </span>
                                    </h3>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                            ₹ {order.totalPrice?.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {order.products?.filter(p => p.is_bulk_order).length} bulk items
                                        </p>
                                    </div>
                                    <FiChevronDown className={`text-xl text-gray-600 transition-transform duration-300 ${expandedOrder === order._id ? 'rotate-180' : ''
                                        }`} />
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedOrder === order._id && (
                                <div className="border-t border-gray-100 p-6 space-y-8">
                                    {/* Customer Information */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-blue-50 p-5 rounded-xl">
                                            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-700">
                                                <FiUser className="text-blue-600" />
                                                Customer Information
                                            </h4>
                                            <div className="space-y-2 text-gray-600">
                                                <p className="font-medium">{order.name}</p>
                                                <div className="flex items-center gap-2">
                                                    <FiMail className="w-4 h-4" />
                                                    <span>{order.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FiPhone className="w-4 h-4" />
                                                    <span>{order.phone || 'Not provided'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-purple-50 p-5 rounded-xl">
                                            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-purple-700">
                                                <FiMapPin className="text-purple-600" />
                                                Shipping Address
                                            </h4>
                                            <div className="space-y-2 text-gray-600">
                                                <p>{order.shippingAddress}</p>
                                                <p>Pincode: {order.pincode}</p>
                                                <p>City: {order.city}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bulk Products Section */}
                                    <div>
                                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
                                            <FiPackage className="text-indigo-600" />
                                            Bulk Order Items
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {order.products?.filter(product => product.is_bulk_order).map((product, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="bg-white p-2 rounded-md shadow-sm">
                                                            <img 
                                                                src={product.product_img_url || '/placeholder.png'} 
                                                                alt={product.product_name}
                                                                className="w-12 h-12 object-contain"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-800">{product.product_name}</p>
                                                            <div className="mt-2 space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                                                        BULK ORDER
                                                                    </span>
                                                                    <span className="text-xs text-gray-600">
                                                                        Range: {product.bulk_range}
                                                                    </span>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                                                    <div className="text-gray-600">
                                                                        Qty: <span className="font-semibold">{product.quantity}</span>
                                                                    </div>
                                                                    <div className="text-gray-600">
                                                                        Price: <span className="font-semibold">₹ {product.product_price}</span>
                                                                    </div>
                                                                    {product.original_price && (
                                                                        <>
                                                                            <div className="text-gray-500 text-xs">
                                                                                Original: ₹ {product.original_price}
                                                                            </div>
                                                                            <div className="text-green-600 text-xs font-semibold">
                                                                                {product.product_discount}% OFF
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                                <div className="text-right mt-2">
                                                                    <span className="text-lg font-bold text-orange-600">
                                                                        ₹ {(product.product_price * product.quantity).toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Regular Products (if any) */}
                                    {order.products?.some(product => !product.is_bulk_order) && (
                                        <div>
                                            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
                                                <FiPackage className="text-gray-600" />
                                                Regular Items
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {order.products?.filter(product => !product.is_bulk_order).map((product, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className="bg-white p-2 rounded-md shadow-sm">
                                                                <img 
                                                                    src={product.product_img_url || '/placeholder.png'} 
                                                                    alt={product.product_name}
                                                                    className="w-12 h-12 object-contain"
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-800">{product.product_name}</p>
                                                                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                                                    <div className="text-gray-600">
                                                                        Qty: {product.quantity}
                                                                    </div>
                                                                    <div className="text-gray-600">
                                                                        Price: ₹ {product.product_price}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Order Summary & Actions */}
                                    <div className="bg-gray-50 p-5 rounded-xl">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div className="space-y-2">
                                                <h5 className="text-sm font-semibold text-gray-500 mb-2">Order Summary</h5>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <FiDollarSign className="w-4 h-4 text-green-600" />
                                                        <span>Total: ₹ {order.totalPrice?.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1 max-w-xs">
                                                <label className="text-sm font-semibold text-gray-500 mb-2 block">
                                                    Update Order Status
                                                </label>
                                                <select
                                                    value={order.status || 'Pending'}
                                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                    className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Confirmed">Confirmed</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {!loading && !error && bulkOrders.length === 0 && (
                    <div className="text-center py-12">
                        <div className="mb-4 text-gray-400">
                            <FiPackage className="text-4xl mx-auto" />
                        </div>
                        <p className="text-black text-lg font-medium">Bulk order is not placed yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WholesaleBulkOrders;