import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faClipboardCheck,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartItemTotalAmount, selectCartItemCount } from "../../slices/cartSlice";
import SITE_CONFIG from "../../controller";
import { Navigate } from "react-router-dom";

const StepIndicator = ({ icon, text, isActive }) => (
  <div className={`flex items-center space-x-2 ${isActive ? "text-red-500" : "text-gray-500"}`}>
    <FontAwesomeIcon icon={icon} />
    <div className="text-xs md:text-sm">{text}</div>
  </div>
);

const PaymentOption = ({ value, label }) => (
  <label className="flex items-center space-x-2 mt-2">
    <input type="radio" name="payment" value={value} />
    <span className="text-md">{label}</span>
  </label>
);

const PaymentDetails = ({ details }) => (
  <div>
    {details.map(({ label, amount }, index) => (
      <React.Fragment key={label}>
        <div className="flex justify-between text-sm md:text-md">
          <span>{label}</span>
          <span>{amount}</span>
        </div>
        {index < details.length - 1 && <hr className="my-2" />}
      </React.Fragment>
    ))}
  </div>
);

const PaymentStep = ({
  onBackToConfirm,
  onBackToCart,
  deliveryCharges,
  couponCode,
  cartItems,
  orderDetail,
  setOrderDetail,
  discount,
  deliverytype,
  isCouponApplied,
}) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const cartItemTotalAmount = useSelector(selectCartItemTotalAmount);
  const cartItemCount = useSelector(selectCartItemCount);
  const storeId = useSelector((state) => state.store.selectedStore);
  const user = localStorage.getItem("User") || ''; 

  useEffect(() => {
    const fetchPaymentOptions = async () => {
      try {
        const response = await axios.get(`${SITE_CONFIG.apiIP}/api/payment`, {
          headers: {
            Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
          },
        });
        console.log('Payment methods response:', response.data); // Log response data
        if (Array.isArray(response.data)) {
          setPaymentMethods(response.data);
        } else {
          console.error('Expected an array of payment methods');
          setPaymentMethods([]); // Set default value if response is not an array
        }
      } catch (error) {
        console.error("Error fetching payment options:", error.response || error.message || error);
      }
    };
    

    fetchPaymentOptions();
  }, []);

  function generateSimpleUID() {
    return 'xxxxxx'.replace(/[x]/g, () => {
        return (Math.random() * 16 | 0).toString(16);
    });
}
const uid = generateSimpleUID();

  useEffect(() => {
    const calculateOrderDetail = () => {
      const subtotal = parseFloat(cartItemTotalAmount);
      const discountAmount = isCouponApplied ? (subtotal * discount) / 100 : 0;
      const totalAmount = subtotal + deliveryCharges - discountAmount;

      setOrderDetail({
        product_details: JSON.stringify(cartItems),
        quantities: JSON.stringify(cartItemCount),
        store_id:storeId,
        address: 'NA',
        payment_mode: 'online',
        order_number: "one", // Replace with actual order number if available
        sub_total: subtotal - discountAmount,
        surcharge: 0, // Changed from "na" to 0
        delivery_charge: deliveryCharges,
        coupon_code: couponCode || 'NA', // Ensure it's an empty string if not provided
        discount,
        order_type: 'online',
        change: 0,
        driver_id:'na',
        tender_amount: 0,
        split_payment: 'NA', // Ensure it's an empty string if not used
        reference_id: 'NA', // Ensure it's an empty string or set appropriately
        status: 'paid',
        grand_total: totalAmount,
        date_time: new Date(),
        notes: 'NA',
        user_id: user,
        uid: uid // Ensure it's an empty string or set appropriately
      });
    };

    calculateOrderDetail();
  }, [cartItems, cartItemCount, cartItemTotalAmount, deliveryCharges, couponCode, discount, isCouponApplied, storeId, user]);

  console.log(orderDetail);
  const placeOrder = async () => {
    try {
      const response = await axios.post(
        `${SITE_CONFIG.apiIP}/api/getorderbystoreid/addorder`,
        orderDetail,
        {
          headers: {
            Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
            'Content-Type': 'application/json',
          }
        }
      );
      // console.log(response.data);
      setPaymentMethods(response.data); // Handle the response as needed
    } catch (error) {
      console.error("Error placing order:", error.response || error.message || error);
    }
  };

  const activePaymentMethods = Array.isArray(paymentMethods)
  ? paymentMethods.filter(method => method.status === 'active')
  : [];


  const paymentDetails = [
    {
      label: "Item Total",
      amount: `$${parseFloat(cartItemTotalAmount).toFixed(2)}`,
    },
    { label: "Delivery Charges", amount: `$${deliveryCharges.toFixed(2)}` },
    ...(isCouponApplied
      ? [
          {
            label: "Product Discount",
            amount: `$${(cartItemTotalAmount * discount) / 100}`,
          },
        ]
      : []),
    {
      label: "Total Amount",
      amount: `$${(
        parseFloat(cartItemTotalAmount) +
        deliveryCharges -
        (cartItemTotalAmount * discount) / 100
      ).toFixed(2)}`,
      isBold: true,
    },
  ];

  return (
    <div className="flex justify-center items-center mt-2 mb-6 px- -mx-2">
      <div className="w-11/12 md:w-7/12 lg:w-9/12">
        <div className="flex flex-col sm:flex-row justify-between mb-3">
          <h1 className="text-xl md:text-2xl font-bold">Payment</h1>
          <div className="flex items-center justify-center ml-6 mt-1 space-x-4">
            <StepIndicator icon={faShoppingCart} text="Your Cart" />
            <div className="w-8 h-px bg-gray-400"></div>
            <StepIndicator icon={faClipboardCheck} text="Confirm Order" />
            <div className="w-8 h-px bg-gray-400"></div>
            <StepIndicator icon={faCreditCard} text="Payment" isActive />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <div className="mt-2">
              {activePaymentMethods.length > 0 ? (
                activePaymentMethods.map((method) => (
                  <PaymentOption
                    key={method._id}
                    value={method.status}
                    label={method.name}
                  />
                ))
              ) : (
                <p>No active payment methods available.</p>
              )}
            </div>
          </div>
          <div className="lg:col-span-5">
            <h3 className="text-md md:text-lg font-semibold mb-4">
              Payment Details
            </h3>
            <PaymentDetails details={paymentDetails} />
            <div className="flex justify-between mt-12 w-full">
              <button
                className="px-6 py-2 text-white w-1/3"
                style={{ background: "#be0500" }}
                onClick={
                  deliverytype === "pickup" ? onBackToCart : onBackToConfirm
                }
              >
                Back
              </button>
              <Link to='/'>
              <button
                className="py-2.5 px-8 text-white w-full"
                style={{ background: "#be0500" }}
                onClick={placeOrder}
              >
                Complete Payment
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
