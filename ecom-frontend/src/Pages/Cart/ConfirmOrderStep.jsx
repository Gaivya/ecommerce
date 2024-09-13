import { useState, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faClipboardCheck,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import {
  selectCartItemCount,
  selectCartItemTotalAmount,
} from "../../slices/cartSlice";
import SITE_CONFIG from "../../controller";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import markerIconUrl from "/marker-icon.png";

import { MdLocationPin } from "react-icons/md";
import debounce from "lodash/debounce";
import axios from "axios";

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

//Icon for Map marker
const markerIcon = new L.Icon({
  iconUrl: markerIconUrl,
  iconSize: [28, 33],
});

const CartItem = ({ item, imageUrl }) => (
  <div className="flex mb-4 mt-4">
    <img
      src={`${imageUrl}${item.item.cover}`}
      alt={item.item.name}
      className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover"
    />
    <div className="ml-4">
      <h4 className="text-sm md:text-md font-semibold mt-6">
        {item.item.name}
      </h4>
    </div>
  </div>
);

const PaymentDetails = ({
  deliveryCharges,
  cartItemTotalAmount,
  isCouponApplied,
  discount,
}) => {
  return (
    <div>
      <h3 className="text-md md:text-lg font-semibold mb-4">Payment Details</h3>
      <div className="flex justify-between text-sm md:text-md">
        <span>Item Total</span>
        <span>${parseFloat(cartItemTotalAmount).toFixed(2)}</span>
      </div>
      <hr className="my-2" />
      <div className="flex justify-between text-sm md:text-md">
        <span>Delivery Charges</span>
        <span>${deliveryCharges}</span>
      </div>
      <hr className="my-2" />
      {isCouponApplied && (
        <div className="flex justify-between text-sm md:text-md">
          <span>Product Discount</span>
          <span>
            {/* {discount}  */}$
            {parseFloat((cartItemTotalAmount * discount) / 100).toFixed(2)}
          </span>
        </div>
      )}
      {isCouponApplied && <hr className="my-2" />}
      <div className="flex justify-between text-sm md:text-md font-semibold">
        <span>Total Amount</span>
        <span>
          $
          {(
            parseFloat(cartItemTotalAmount) +
            deliveryCharges -
            (cartItemTotalAmount * discount) / 100
          ).toFixed(2)}
        </span>
      </div>
    </div>
  );
};
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

const ConfirmOrderStep = ({
  cartItems,
  onBackToCart,
  onProceedToPayment,
  deliveryCharges,
  discount,
  isCouponApplied,
}) => {
  const cartItemTotalAmount = useSelector(selectCartItemTotalAmount);
  const cartItemCount = useSelector(selectCartItemCount);
  const { imageUrl } = SITE_CONFIG;
  const [address, SetAddress] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [addressPopup, setAddressPopup] = useState(false);
  const [addressSearchPopup, setAddressSearchPopup] = useState(false);
  const [addressType, setAddressType] = useState("home");
  const [houseText, setHouseText] = useState("");
  const [landmarkText, setLandmarkText] = useState("");
  const [pincodeText, setPincodeText] = useState("");
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [deliveryArea, setDeliveryArea] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [editAddressId, setEditAddressId] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json`
      );

      if (response.status !== 200) {
        throw new Error("Error fetching address suggestions");
      }

      const data = response.data;
      setSuggestions(data.map((item) => item.display_name));
    } catch (error) {
      console.error(error);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    []
  );

  const handleInputChange = (event) => {
    const { value } = event.target;
    setInputText(value);
    debouncedFetchSuggestions(value);
  };

  const user = localStorage.getItem("User");

  const validateForm = () => {
    const errors = {};
    if (!deliveryArea) errors.deliveryArea = "Delivery area is required";
    if (!houseText) errors.house = "House/Flat No is required";
    if (!landmarkText) errors.landmark = "Landmark is required";
    if (!pincodeText) errors.pincode = "Pincode is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const updateUserAddress = async () => {
    if (!validateForm()) return;

    if (!user) {
      console.error("User ID not found in localStorage");
      return;
    }

    const newAddress = {
      title: addressType,
      address: deliveryArea,
      house: houseText,
      landmark: landmarkText,
      pincode: pincodeText,
      lat: location.latitude || 0,
      lng: location.longitude || 0,
    };

    let updatedAddresses;

    if (editAddressId !== null) {
      updatedAddresses = userAddresses.map((address, index) =>
        index === editAddressId ? newAddress : address
      );
    } else {
      updatedAddresses = [...userAddresses, newAddress];
    }

    const updatedAddressesString = JSON.stringify(updatedAddresses);

    try {
      const response = await axios.post(
        `${SITE_CONFIG.apiIP}/api/alluser/updateuseraddress`,
        {
          _id: user,
          address: updatedAddressesString,
        },
        {
          headers: {
            Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
          },
        }
      );

      if (response.data.success) {
        getSingleUser();
        setDeliveryArea("");
        setHouseText("");
        setLandmarkText("");
        setPincodeText("");
        setAddressType("");
      }

      setAddressPopup(false);
      setEditAddressId(null);
    } catch (error) {
      console.error("Error updating user address:", error);
    }
  };

  const handleAddressClick = (address) => {
    setDeliveryArea(address);
    setAddressSearchPopup(false);
    setSuggestions([]);
    setInputText("");
  };

  const getSingleUser = async () => {
    try {
      const response = await axios.post(
        `${SITE_CONFIG.apiIP}/api/alluser/getuserbyid`,
        { _id: user },
        {
          headers: {
            Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
          },
        }
      );
      const addressData = response.data[0].address;
      setUserAddresses(JSON.parse(addressData));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getSingleUser();
  }, []);
  const addreshandlecall = () => {
    if (!address) {
      notifyError("please select a addres");
      return;
    }
    onProceedToPayment();
  };

  useEffect(() => {
    const handlePosition = async (position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      setDeliveryArea(response.data.display_name);
    };

    navigator.geolocation.getCurrentPosition(handlePosition);
  }, []);

  return (
    <>
      <div className="flex justify-center items-center w-full mt-2 mb-6 px-2">
        <div className="w-12/12 md:w-6/12 lg:w-9/12">
          <div className="flex flex-col sm:flex-row justify-between mb-3">
            <h2 className="text-xl md:text-2xl font-bold">Confirm Order</h2>
            <div className="flex items-center justify-center ml-6 mt-1 space-x-4">
              <StepIndicator icon={faShoppingCart} text="Your Cart" />

              <div className="w-8 h-px bg-gray-400"></div>

              <StepIndicator
                icon={faClipboardCheck}
                text="Confirm Order"
                isActive
              />

              <div className="w-8 h-px bg-gray-400"></div>

              <StepIndicator icon={faCreditCard} text="Payment" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Section: Basket/Order Items */}
            <div className="lg:col-span-7 ">
              <div className="relative flex flex-wrap items-start gap-2 p-2">
                <div
                  onClick={() => setAddressPopup(true)}
                  className="flex flex-col items-center justify-center  cursor-pointer w-[240px] p-[50px] hover:bg-gray-200 transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white bg-black rounded-full"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v14m-7-7h14"
                    />
                  </svg>
                  <span className="text-black">Add New Address</span>
                </div>
                {userAddresses &&
                  userAddresses.map((address, index) => (
                    <div
                      key={index}
                      className={`relative max-w-md bg-white rounded-lg p-1 mb-4 w-[240px] cursor-pointer                       `}
                      onClick={() => {
                        SetAddress(true), setSelectedAddressIndex(index);
                      }}
                    >
                      {selectedAddressIndex === index && (
                        <div className="absolute top-2 right-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 bg-red-500 text-white rounded-full"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="text-lg font-bold uppercase">
                        {address.title}
                      </div>
                      <div className="text-sm">
                        <div>
                          {address.house}, {address.landmark}, {address.address}
                        </div>
                        <div>{address.pincode}</div>
                      </div>
                    </div>
                  ))}

                {(addressPopup || addressSearchPopup) && (
                  <div className="fixed -inset-8 bg-black bg-opacity-50 p-4 flex justify-center items-center z-30 min-h-[600px] overflow-y-auto">
                    {addressPopup && !addressSearchPopup && (
                      <div className="relative bg-white p-4 shadow-lg w-full max-w-lg h-[100%] overflow-y-auto">
                        <button
                          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-3xl"
                          onClick={() => setAddressPopup(false)}
                        >
                          &times;
                        </button>
                        <h1 className="text-2xl font-semibold mb-4">
                          Set your delivery location
                        </h1>
                        <div
                          style={{
                            backgroundColor: location ? "transparent" : "gray",
                            height: "200px",
                            width: "100%",
                          }}
                        >
                          {location.latitude ? (
                            <MapContainer
                              center={[location.latitude, location.longitude]}
                              zoom={15}
                              style={{ height: "200px", width: "100%" }}
                            >
                              <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              />
                              <Marker
                                position={[
                                  location.latitude,
                                  location.longitude,
                                ]}
                                icon={markerIcon}
                              >
                                <Popup>
                                  A marker at latitude {location.latitude},
                                  longitude {location.longitude}.
                                </Popup>
                              </Marker>
                            </MapContainer>
                          ) : (
                            <div
                              style={{
                                color: "gray",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                              }}
                            >
                              Location services are off. Please turn on location
                              services to view the map.
                            </div>
                          )}
                        </div>

                        <div className="mt-4">
                          <label
                            htmlFor="DeliveryArea"
                            className="block text-sm font-medium text-gray-700 mb-2 uppercase"
                          >
                            Delivery Area
                          </label>

                          <div className="relative w-full">
                            <input
                              id="DeliveryArea"
                              type="text"
                              value={deliveryArea}
                              className={`w-full border border-gray-300 rounded-lg p-2 pr-16 ${
                                formErrors.deliveryArea ? "border-red-500" : ""
                              }`}
                              placeholder="Enter Delivery Area"
                              readOnly
                            />
                            <button
                              onClick={() => setAddressSearchPopup(true)}
                              className="absolute font-bold bg-white rounded-l-none top-0 right-0 h-full text-[#B91C1C] rounded-lg px-4 py-2"
                            >
                              Change
                            </button>
                          </div>
                          {formErrors.deliveryArea && (
                            <p className="text-red-500 text-sm">
                              {formErrors.deliveryArea}
                            </p>
                          )}
                          <div className="my-4">
                            <label
                              htmlFor="house"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              House/Flat No
                            </label>
                            <input
                              id="house"
                              type="text"
                              value={houseText}
                              onChange={(e) => setHouseText(e.target.value)}
                              className={`w-full border border-gray-300 rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                formErrors.house ? "border-red-500" : ""
                              }`}
                            />
                            {formErrors.house && (
                              <p className="text-red-500 text-sm">
                                {formErrors.house}
                              </p>
                            )}

                            <label
                              htmlFor="landmark"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Landmark
                            </label>
                            <input
                              id="landmark"
                              type="text"
                              value={landmarkText}
                              onChange={(e) => setLandmarkText(e.target.value)}
                              className={`w-full border border-gray-300 rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                formErrors.landmark ? "border-red-500" : ""
                              }`}
                            />
                            {formErrors.landmark && (
                              <p className="text-red-500 text-sm">
                                {formErrors.landmark}
                              </p>
                            )}

                            <label
                              htmlFor="pincode"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Pincode
                            </label>
                            <input
                              id="pincode"
                              type="text"
                              value={pincodeText}
                              onChange={(e) => setPincodeText(e.target.value)}
                              className={`w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                formErrors.pincode ? "border-red-500" : ""
                              }`}
                            />
                            {formErrors.pincode && (
                              <p className="text-red-500 text-sm">
                                {formErrors.pincode}
                              </p>
                            )}

                            <label
                              htmlFor="addressType"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Address Type
                            </label>
                            <select
                              id="addressType"
                              value={addressType}
                              onChange={(e) => setAddressType(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                            >
                              <option value="home">Home</option>
                              <option value="work">Work</option>
                              <option value="office">Office</option>
                            </select>

                            <div className="flex justify-center mt-5">
                              <button
                                onClick={updateUserAddress}
                                className="bg-[#FF3547] text-white h-10 w-20 mr-5"
                              >
                                EDIT
                              </button>
                              <button
                                className="text-[#FF3547] h-10 w-20 border-2 border-[#FF3547] bg-white"
                                onClick={() => {
                                  setAddressPopup(false);
                                  setDeliveryArea("");
                                  setHouseText("");
                                  setLandmarkText("");
                                  setPincodeText("");
                                  setAddressType("");
                                }}
                              >
                                CANCEL
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {addressSearchPopup && (
                      <div className="fixed inset-0 bg-white left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 justify-center shadow-md z-50 lg:w-[60%] w-[90%] ">
                        <h1 className="font-semibold text-2xl">
                          Search Location
                        </h1>
                        <br />
                        <input
                          type="text"
                          placeholder="Search"
                          value={inputText}
                          onChange={handleInputChange}
                          className="w-full p-2 border-b-2 border-gray-400"
                        />
                        <ul className="mt-2 overflow-auto h-[70%]">
                          {suggestions.map((address) => (
                            <li
                              key={address}
                              onClick={() => handleAddressClick(address)}
                              className="cursor-pointer flex hover:bg-gray-100 p-2 rounded-md"
                            >
                              <MdLocationPin
                                color="gray"
                                size={22}
                                className="mr-2"
                              />
                              {address}
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => {
                            setAddressSearchPopup(false);
                            setSuggestions([]);
                            setInputText("");
                          }}
                          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-3xl"
                        >
                          &times;
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <h3 className="text-md font-semibold">
                  Basket{" "}
                  <span className="text-gray-500">
                    ({cartItemCount} item{cartItemCount > 1 ? "s" : ""})
                  </span>
                </h3>
                <h3 className="text-sm md:text-md font-semibold">
                  $ {parseFloat(cartItemTotalAmount).toFixed(2)}
                </h3>
              </div>
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} imageUrl={imageUrl} />
              ))}
              <hr />
            </div>
            {/* Right Section: Payment Details */}
            <div className="lg:col-span-5">
              <PaymentDetails
                cartItems={cartItems}
                deliveryCharges={deliveryCharges}
                cartItemTotalAmount={cartItemTotalAmount}
                discount={discount}
                isCouponApplied={isCouponApplied}
              />
              <div className="flex justify-between mt-12">
                <button
                  className="px-6 py-2 text-white w-1/3 "
                  style={{ background: "#be0500" }}
                  onClick={onBackToCart}
                >
                  Back
                </button>
                <button
                  className="px-6 py-2 text-white w-1/2 "
                  style={{ background: "#be0500" }}
                  onClick={addreshandlecall}
                >
                  Make Payment
                </button>
              </div>
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

export default ConfirmOrderStep;
