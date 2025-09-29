import { toast } from "react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const backend = import.meta.env.VITE_BACKEND;

export const handlePhonePePayment = async ({
  product,
  quantity,
  navigate,
  setLoadingBuyNow = () => {},
  customShippingFee = 5,
}) => {
  setLoadingBuyNow(true);
  
  try {
    if (!product) {
      toast.error("Product not found");
      return;
    }

    if (!product.product_instock) {
      toast.error("Product is out of stock");
      return;
    }

    if (product.no_of_product_instock && quantity > product.no_of_product_instock) {
      toast.error(`Only ${product.no_of_product_instock} items available in stock`);
      return;
    }

    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    const parsedToken = storedToken.startsWith('"') ? JSON.parse(storedToken) : storedToken;
    const decoded = jwtDecode(parsedToken);
    const userId = decoded.id || decoded.userId || decoded._id || decoded.sub;

    if (!userId) {
      toast.error("Authentication failed");
      navigate("/login");
      return;
    }

    // Get user details
    const userResponse = await axios.get(`${backend}/user/${userId}`, {
      headers: { Authorization: `Bearer ${parsedToken}` },
    });

    if (!userResponse.data?.data?.user) {
      throw new Error("Failed to fetch user details");
    }

    const userData = userResponse.data.data.user;
    const expectedDelivery = new Date();
    expectedDelivery.setDate(expectedDelivery.getDate() + 4);

    const orderItem = {
      product_id: product._id,
      quantity: quantity,
      product_name: product.product_name,
      product_sku: product.SKU,
      product_price: product.discounted_single_product_price,
      product_tax_rate: "0",
      product_hsn_code: "0",
      product_discount: "0",
      product_img_url: product.product_image_main,
    };

    const totalPrice = Math.max(0, product.discounted_single_product_price * quantity + customShippingFee);

    const orderData = {
      user_id: userId,
      products: [orderItem],
      totalPrice: totalPrice,
      shippingAddress: userData.address?.[0] || "",
      shippingCost: customShippingFee,
      email: userData.email,
      pincode: userData.address?.[0]?.match(/\b\d{6}\b/)?.[0] || "000000",
      name: userData ? `${userData.name}` : "",
      city: userData.address?.[0]?.split(",").slice(-2, -1)[0]?.trim() || "City",
      expectedDelivery: expectedDelivery,
    };

    // Create the order
    const orderResponse = await axios.post(
      `${backend}/order/new`,
      { order: orderData },
      { headers: { Authorization: `Bearer ${parsedToken}` } }
    );

    if (!orderResponse.data?.data?.order?._id) {
      throw new Error("Failed to create order");
    }

    const createdOrderId = orderResponse.data.data.order._id;

    // Prepare PhonePe payment data
    const paymentData = {
      orderId: createdOrderId,
      userId: userId,
      FRONTEND_URL: window.location.origin,
      MUID: "MUID" + Date.now()
    };

    console.log('Initiating PhonePe payment with:', paymentData);

    // Initialize PhonePe payment
    const paymentResponse = await axios.post(
      `${backend}/payment/create-phonepe-payment`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${parsedToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log('PhonePe payment response:', paymentResponse.data);

    if (paymentResponse.data?.status === "Success" && paymentResponse.data?.data?.response?.phonepeResponse?.redirectUrl) {
      const { phonepeResponse } = paymentResponse.data.data.response;
      
      // Store payment info for verification
      sessionStorage.setItem('pendingPayment', JSON.stringify({
        paymentId: paymentResponse.data.data.response.payment._id,
        orderId: createdOrderId
      }));

      // Redirect to PhonePe payment page
      window.location.href = phonepeResponse.redirectUrl;
    } else {
      throw new Error("Failed to initialize PhonePe payment");
    }
  } catch (error) {
    console.error("PhonePe payment error:", error);
    let errorMessage = "Failed to process payment";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    toast.error(errorMessage);
  } finally {
    setLoadingBuyNow(false);
  }
};