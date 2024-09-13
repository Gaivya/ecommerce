import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export default function OrderDetails() {
  const { orderId } = useParams(); // Get the order ID from the URL
  const [order, setOrder] = useState(null); // Local state for order details
  const orderDetailsFromStore = useSelector((state) => state.orderDetails); // Get order details from Redux store
  console.log(orderId);
  console.log(orderDetailsFromStore);
  
  useEffect(() => {
    // Optionally, you can fetch data if it's not available in Redux
    // For example, if order details are not in the store or you want to refresh
    if (orderDetailsFromStore && orderDetailsFromStore._id === orderId) {
      setOrder(orderDetailsFromStore);
    } else {
      // Fetch order details from an API or some other source if not found in store
      // Example API call:
      // fetchOrderDetails(orderId).then(data => setOrder(data));
    }
  }, [orderId, orderDetailsFromStore]);

  if (!order) {
    return <div className="text-center text-gray-500">No order details available.</div>;
  }

  // Parse product details from JSON string
  const productDetails = JSON.parse(order.product_details || '[]');
  const totalItems = productDetails.length; // Number of products
  console.log(productDetails[0]);

  return (
    <section className="h-100 bg-gray-100 py-5">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center h-full">
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <p className="text-lg font-semibold text-[#B91C1C] mb-2 sm:mb-0">Receipt</p>
                <p className="text-sm text-gray-500">Receipt Voucher: {order.reference_id}</p>
              </div>

              {productDetails.map((product, index) => (
                <div key={index} className="border shadow-sm mb-4">
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-1/6 mb-2 sm:mb-0">
                        <img
                          src={productDetails[0].item.cover} 
                          alt={product.name}
                          className="w-full h-auto"
                        />
                      </div>
                      <div className="w-full sm:w-5/6">
                        <div className="flex flex-col sm:flex-row justify-between text-gray-600 text-sm">
                          <p className="flex-1 text-center">{productDetails[0].item.name}</p>
                          <p className="flex-1 text-center">{product.size}</p>
                          <p className="flex-1 text-center">Price: ${productDetails[0].item.sell_price}</p>
                          <p className="flex-1 text-center">Qty: {order.quantities[index]}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-col md:flex-row justify-between pt-2">
                <p className="font-bold mb-2 md:mb-0">Order Details</p>
                <p className="text-gray-600">
                  <span className="font-bold mr-4">Total</span> ${order.grand_total}
                </p>
              </div>

              <div className="flex flex-col md:flex-row justify-between pt-2">
                <p className="text-gray-600">Invoice Number : {order.reference_id}</p>
                <p className="text-gray-600">
                  <span className="font-bold mr-4">Discount</span> ${order.discount}
                </p>
              </div>

              <div className="flex flex-col md:flex-row justify-between">
                <p className="text-gray-600">Invoice Date : {new Date(order.date_time).toLocaleDateString()}</p>
                <p className="text-gray-600">
                  <span className="font-bold mr-4">Delivery Charges</span> ${order.delivery_charge}
                </p>
              </div>

              <div className="flex flex-col md:flex-row justify-between mb-5">
                <p className="text-gray-600">Receipts Voucher : {order.reference_id}</p>
                <p className="text-gray-600">
                  <span className="font-bold mr-4">GST 18%</span> ${order.surcharge}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 bg-[#B91C1C] rounded-b-lg">
              <h5 className="text-white text-lg font-semibold text-right">
                Total paid: <span className="text-2xl">${order.grand_total}</span>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
