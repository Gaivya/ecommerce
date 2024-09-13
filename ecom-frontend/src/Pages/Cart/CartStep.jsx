import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faShoppingCart,
  faClipboardCheck,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementItemQuantity,
  incrementItemQuantity,
  selectCartItemCount,
  selectCartItemTotalAmount,
} from "../../slices/cartSlice";
import { removeItemFromCart } from "../../slices/cartSlice";
import Login from "../../Components/Login/Login";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SITE_CONFIG from "../../controller";
import { FaLocationPin } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { addWeeks, startOfToday } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './CartStep.css'
const StepIndicator = ({ icon, text, isActive }) => (
  <div
    className={`flex items-center space-x-2 ${
      isActive ? "text-red-500" : "text-gray-500"
    }`}
  >
    <FontAwesomeIcon icon={icon} />
    <div className="text-xs md:text-sm">{text}</div>
  </div>
);

const CartItem = ({
  item,
  handleDeleteCartItem,
  handleEditCartItem,
  handleDecrease,
  handleIncrease,
  imageUrl,
}) => (
  <div className="p-4 rounded-lg md:p-6">
    <div className="flex flex-col mt-4 md:mt-6 md:flex-row justify-between">
      <div className="flex">
        <img
          src={`${imageUrl}${item.item.cover}`}
          alt={item.item.name}
          className="w-20 h-20 rounded object-cover"
        />
        <div className="p-4">
          <h4 className="text-xs md:text-sm font-semibold">{item.item.name}</h4>
          {item.item.size === "2" && (
            <p className="text-gray-600 text-xs md:text-sm font-semibold">
              ${" "}
              {(
                (item.item.sell_price -
                  (item.item.sell_price * item.item.discount) / 100) *
                item.weight
              ).toFixed(2)}{" "}
              / {parseFloat(item.weight).toFixed(2)} KG{" "}
              {item.quantity !== 1 && `x${item.quantity}`}
            </p>
          )}
          {item.item.size === "0" && (
            <p className="text-gray-600 text-xs md:text-sm font-semibold">
              $ {parseFloat(item.amount * item.quantity).toFixed(2)} /{" "}
              {item.quantity} Piece
            </p>
          )}
          {item.item.size === "1" && (
            <p className="text-gray-600 text-xs md:text-sm font-semibold">
              $ {parseFloat(item.amount * item.quantity).toFixed(2)} /{" "}
              {item.quantity} Piece
            </p>
          )}
        </div>
      </div>
      {item.item.size === "2" && (
        <div className="flex space-x-4 md:ml-auto self-end">
          <button
            onClick={() => handleEditCartItem(item)}
            className="text-green-500 hover:text-green-700"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => handleDeleteCartItem(item.id)}
            className=""
            style={{ color: "#be0500" }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      )}

      {item.item.size === "1" && (
        <div className="quantity-controls handlebtn" >
          <button
            className="quantity-controls-button"
            onClick={() => handleDecrease(item.item._id)}
          >
            <FaMinus />
          </button>
          <span className="quantity-controls-count">{item.quantity}</span>
          <button
            className="quantity-controls-button"
            onClick={() => handleIncrease(item.item._id)}
          >
            <FaPlus />
          </button>
        </div>
      )}

      {item.item.size === "0" && (
        <div className="quantity-controls handlebtn">
          <button
            className="quantity-controls-button"
            onClick={() => handleDecrease(item.item._id)}
          >
            <FaMinus />
          </button>
          <span className="quantity-controls-count">{item.quantity}</span>
          <button
            className="quantity-controls-button"
            onClick={() => handleIncrease(item.item._id)}
          >
            <FaPlus />
          </button>
        </div>
      )}
    </div>

    <hr />
  </div>
);

const Popup = ({
  isVisible,
  onToggle,
  coupons,
  setCouponCode,
  handleApplyCoupon,
}) => {
  if (!isVisible) return null;

  const handleCouponClick = (code) => {
    setCouponCode(code);
    handleApplyCoupon(code);
    onToggle();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 shadow-lg w-95 rounded-md">
        <h4 className="text-xl font-medium mb-4 text-center">Apply Coupon</h4>
        <div className="mt-4">
  <p className="text-center mb-2 text-gray-600">Use coupon code:</p>
  <div className="max-h-[300px] overflow-y-auto">  {/* Set a maximum height and enable vertical scrolling */}
    {coupons.length > 0 ? (
      coupons.map((coupon) => (
        <div
          key={coupon._id}
          onClick={() => handleCouponClick(coupon.coupan_code)}
          className="border border-gray-600 rounded p-2 mb-2 cursor-pointer hover:bg-gray-100"
        >
          <p className="text-lg font-semibold text-blue-600">
            {coupon.coupan_code}
          </p>
          <p className="text-sm text-gray-600">{coupon.name}</p>
          <p className="text-xs text-gray-500 mt-2">
            {coupon.description}
          </p>
        </div>
      ))
    ) : (
      <p className="text-center text-gray-600">No coupons available.</p>
    )}
  </div>
</div>

        <div className="flex justify-center">
          <button
            onClick={onToggle}
            className="mt-4 px-6 py-2 text-white bg-[#BE0500] rounded shadow-md hover:bg-[#ae2019]"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

const CartStep = ({
  cartItems,
  onPlaceOrder,
  onTogglePopup,
  isPopupVisible,
  isLoggedIn,
  setIsLoggedIn,
  deliveryCharges,
  setDeliveryCharges,
  discount,
  setDiscount,
  isCouponApplied,
  setIsCouponApplied,
  couponCode,
  setCouponCode,
  setDeliverytype,
  handleProceedToPayment,
}) => {
  const { imageUrl } = SITE_CONFIG;
  const [deliveryOption, setDeliveryOption] = useState("home");
  const dispatch = useDispatch();
  const cartItemCount = useSelector(selectCartItemCount);

  const cartItemTotalAmount = useSelector(selectCartItemTotalAmount);
  const [openLogin, setOpenLogin] = useState(false);
  const [coupons, setcoupan] = useState([]);
  const storename = useSelector((state) => state.storeName.name);
  const storeAddress = useSelector((state) => state.storeName.address);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const navigate = useNavigate();
  const handleEditCartItem = (item) => {
    localStorage.setItem("productData", JSON.stringify(item.item));
    navigate("/product");
  };
  const today = startOfToday();

  const handleIncrease = (id) => {
    dispatch(incrementItemQuantity(id));
  };

  const handleDecrease = (id) => {
    dispatch(decrementItemQuantity(id));
  };

  // Calculate the date one week from today
  const oneWeekFromToday = addWeeks(today, 1);
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDateSelected(true);
  };

  const handleDeliveryOptionChange = (e) => {
    setDeliveryOption(e.target.value);
    setDeliverytype(e.target.value);
    setSelectedDate(null);
    setIsDateSelected(false);
  };

  const handlePlaceOrder = () => {
    if (deliveryOption === "pickup" && !isDateSelected) {
      notifyError("Please select a pickup date");
      return;
    }
    if (deliveryOption === "pickup" && isDateSelected) {
      handleProceedToPayment();
    } else {
      onPlaceOrder();
    }
  };

  useEffect(() => {
    if (deliveryOption === "home") {
      setDeliveryCharges(20);
    } else {
      setDeliveryCharges(0);
    }
  }, [deliveryOption]);

  const notifyError = (message) =>
    toast.error(message, {
      position: "bottom-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  const notifySuccess = (message) =>
    toast.success(message, {
      position: "bottom-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const handleDeleteCartItem = (id) => {
    dispatch(removeItemFromCart(id));
  };
  const handleShowLogin = () => {
    setOpenLogin(true);
  };

  const fetchcoupan = async () => {
    try {
      const response = await axios.post(`${SITE_CONFIG.apiIP}/api/coupan`,{}, {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
        },
      });
      const activeCoupons = response.data.filter(
        (coupon) => coupon.status === "active"
      );
      setcoupan(activeCoupons);
    } catch (error) {
      console.error("Error fetching store data:", error);
    }
  };

  const handleInputChange = (e) => {
    setIsCouponApplied(false);
    setCouponCode(e.target.value);
    setDiscount(0);
  };

  const handleApplyCoupon = (couponcode) => {
    if (cartItemTotalAmount < 100) {
      notifyError("Sorry minimum cart value must be 100 or equal");
      return;
    }

    const matchedCoupon = coupons.find(
      (coupon) => coupon.coupan_code === couponcode
    );

    if (matchedCoupon) {
      setIsCouponApplied(true);
      setDiscount(matchedCoupon.discount_value);
      notifySuccess("Coupon code applied !");
    } else {
      notifyError("Invalid coupon code");
      setIsCouponApplied(false);
      setDiscount(0);
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setCouponCode("");
    notifySuccess("Removed coupon code");
    setIsCouponApplied(false);
  };

  useState(() => {
    fetchcoupan();
  });
  return (
    <>
      {openLogin && (
        <Login
          openLogin={openLogin}
          setOpenLogin={setOpenLogin}
          setIslogin={setIsLoggedIn}
        />
      )}
      <div className="container mx-auto p-2 md:p-8 max-w-6xl">
        {/* Cart Steps */}
        <div className="flex flex-col sm:flex-row justify-between">
          <h2 className="md:text-2xl font-bold ml-6">
            Cart({cartItems.length})
          </h2>
          <div className="flex items-center justify-center ml-6 mt-1 space-x-2">
            <StepIndicator icon={faShoppingCart} text="Your Cart" isActive />

            <div className="w-16 h-px bg-gray-400"></div>

            <StepIndicator icon={faClipboardCheck} text="Confirm Order" />

            <div className="w-16 h-px bg-gray-400"></div>

            <StepIndicator icon={faCreditCard} text="Payment" />
          </div>
        </div>

        {/* Cart Items */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-10 mt-4">
          {/* Left Section - Cart Items */}

          <div className="lg:col-span-7">
            <div className="flex justify-between mx-4">
              <h3 className="text-xs font-semibold md:text-sm">
                Basket{" "}
                <span className="text-gray-500 text-xs md:text-sm">
                  ({cartItemCount} item{cartItemCount > 1 ? "s" : ""})
                </span>
              </h3>
              <h3 className="text-xs font-semibold md:text-sm">
                $ {parseFloat(cartItemTotalAmount).toFixed(2)}
              </h3>
            </div>
            {console.log(cartItems)}
            {console.log(cartItemCount)}
            {cartItems.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                handleDeleteCartItem={handleDeleteCartItem}
                handleEditCartItem={handleEditCartItem}
                handleDecrease={handleDecrease}
                handleIncrease={handleIncrease}
                imageUrl={imageUrl}
              />
            ))}
          </div>

          {/* Right Section - Summary and Options */}
          <div className="lg:col-span-5">
            <div className="p-4 space-y-6 md:p-6 md:space-y-8">
              {/* Authentication (conditionally rendered) */}
              {!isLoggedIn && (
                <div className="mt-2">
                  <h3 className="text-md font-semibold">Authentication</h3>
                  <p className="mt-2">
                    <a
                      className="underline"
                      style={{ color: "#be0500" }}
                      onClick={handleShowLogin}
                    >
                      Log in
                    </a>{" "}
                    to see the best offers and cashback deals
                  </p>
                </div>
              )}

              {/* Apply Coupon */}
              <div>
                <div className="flex justify-between">
                  <h3 className="text-md font-semibold">Apply Coupon</h3>
                  <a
                    href="#"
                    className="inline-block mt-2 text-sm"
                    style={{ color: "#be0500" }}
                    onClick={(e) => {
                      e.preventDefault();
                      if (isLoggedIn) onTogglePopup();
                      else {
                        handleShowLogin();
                      }
                    }}
                  >
                    View deals
                  </a>
                </div>
                <div className="flex mt-2">
                  <input
                    value={cartItemTotalAmount >100 ? couponCode:""}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Enter coupon code"
                    className="flex-grow rounded-l-lg focus:outline-none"
                  />
                  {!isCouponApplied && (
                    <button
                      onClick={() => {
                        if (isLoggedIn) {
                          handleApplyCoupon(couponCode);
                        } else {
                          handleShowLogin();
                        }
                      }}
                      className="p-2 text-gray-600 border-none rounded-r-lg"
                    >
                      APPLY
                    </button>
                  )}

                  {isCouponApplied && (
                    <button
                      onClick={handleRemoveCoupon}
                      className="p-2 text-gray-600 border-none rounded-r-lg"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <hr />
                <Popup
                  isVisible={isPopupVisible}
                  onToggle={onTogglePopup}
                  coupons={coupons}
                  couponCode={couponCode}
                  setCouponCode={setCouponCode}
                  handleApplyCoupon={handleApplyCoupon}
                />
              </div>

              {/* Payment Details */}
              <div>
                <h3 className="text-md font-semibold">Payment Details</h3>
                <div className="mt-4">
                  <div className="flex justify-between mb-3">
                    <span>Item Total</span>
                    <span>${parseFloat(cartItemTotalAmount).toFixed(2)}</span>
                  </div>
                  <hr />

                  <div className="flex justify-between mt-2 mb-3">
                    <span>Delivery Charges</span>
                    <span>${deliveryCharges.toFixed(2)}</span>
                  </div>
                  <hr />
                  {isCouponApplied && (
                    <div className="flex justify-between mt-2 mb-3">
                      <span>Product Discount</span>
                      <span>
                        $
                        {parseFloat(
                          (cartItemTotalAmount * discount) / 100
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between mt-2 font-semibold">
                    <span>Total Amount</span>
                    <span>
                      $
                      {(
                        parseFloat(cartItemTotalAmount) +
                        deliveryCharges -
                        parseFloat((cartItemTotalAmount * discount) / 100)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Notes */}
              <div>
                <h3 className="text-md">Special Notes</h3>
                <textarea className="w-full p-1 mt-2 border rounded-md focus:outline-none" ></textarea>
              </div>

              {/* Delivery Options */}
              <div>
                <h3 className="text-md font-semibold">Delivery Options</h3>
                <div className="mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="delivery"
                      value="home"
                      checked={deliveryOption === "home"}
                      onChange={handleDeliveryOptionChange}
                    />
                    <span className="text-md">At Home 🏠</span>
                  </label>
                  <label className="flex items-center mt-2 space-x-2">
                    <input
                      type="radio"
                      name="delivery"
                      value="pickup"
                      checked={deliveryOption === "pickup"}
                      onChange={handleDeliveryOptionChange}
                    />
                    <span className="text-md">Self Pickup 🏬</span>
                  </label>
                </div>
              </div>

              {/* Receive At */}
              {deliveryOption === "pickup" && (
                <div className="text-md font-semibold flex items-center gap-2">
                  <FaCalendarAlt />
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    minDate={today}
                    maxDate={oneWeekFromToday}
                    dateFormat="yyyy/MM/dd"
                    placeholderText={`Select Pick up Date`}
                    className="w-56 "
                  />
                </div>
              )}

              {/* Store (conditionally rendered) */}
              {deliveryOption === "pickup" && (
                <div>
                  <h3 className="text-md font-semibold">Store</h3>
                  <div className="mt-2">
                    <p className="text-sm font-bold flex items-center">
                      <span className="mr-2">
                        <FaLocationPin />
                      </span>
                      {storename}
                    </p>
                    <p className="text-xs">{storeAddress}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Place Order Button */}

            <div className="flex justify-end mt-4">
              <button
                className="w-1/2 px-4 py-2 text-white"
                style={{ background: "#be0500" }}
                onClick={isLoggedIn ? handlePlaceOrder : handleShowLogin}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default CartStep;
