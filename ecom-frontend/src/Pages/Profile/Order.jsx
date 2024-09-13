import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileSidebarMenu from "../../Components/ProfileSidebarMenu";
import axios from "axios";
import SITE_CONFIG from "../../controller";
import OrderCard from "./OrderCard";
import { setOrderDetails } from "../../slices/orderDetailsSlice";
// import { setOrderDetails } from "../../slices/orderDetailsSlice"; // Import your action

const Order = () => {
  const [userinfo, setUserinfo] = React.useState(null); // Initialize with null
  const [loading, setLoading] = React.useState(true); // Add loading state
  const [error, setError] = React.useState(null); // Add error state

  const dispatch = useDispatch(); // Hook to dispatch actions
  const navigate = useNavigate(); // Hook for navigation

  const id = localStorage.getItem("User");

  const getOrderDetails = async () => {
    try {
      const response = await axios.post(
        `${SITE_CONFIG.apiIP}/api/getorderbyuserid`,
        { user_id: id },
        {
          headers: {
            Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
          },
        }
      );
      setUserinfo(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error.response || error.message || error);
      setError("Error fetching user data. Please try again later."); // Set error state
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };
  React.useEffect(() => {
    if (id) {
      getOrderDetails();
    }
  }, []);
  
  const handleViewDetails = (order) => {
    dispatch(setOrderDetails(order)); // Dispatch order details to Redux store
    navigate(`/orderdetail/${order._id}`); // Navigate to order detail page
  };
  
  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading user info...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  console.log(userinfo);

  return (
    <div className="lg:mx-[60px] px-[15px] bg-white">
      <div className="flex">
        {/*------------------------------ Sidebar Menu ----------------------------------*/}
        <ProfileSidebarMenu />
        {/*-------------- User Order History  ---------------------*/}
        <div className="w-full sm:w-3/4 p-8">
          <h2 className="text-lg font-bold mb-4">Order History</h2>
          <div className="flex flex-wrap gap-5">
          {userinfo && userinfo.length > 0 ? (
            userinfo.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onClick={() => handleViewDetails(order)} // Pass the click handler
              />
            ))
          ) : (
            <div className="text-center text-gray-500">No orders found.</div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
