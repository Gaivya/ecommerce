import { useState, useEffect, useCallback } from "react";
import ProfileBanner from "../../Components/ProfileBanner";
import ProfileSidebarMenu from "../../Components/ProfileSidebarMenu";
import axios from "axios";
import SITE_CONFIG from "../../controller";
import { MdLocationPin } from "react-icons/md";
import debounce from "lodash/debounce";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconUrl from "/marker-icon.png";

const Address = () => {
  const [userinfo, setUserinfo] = useState([]);
  const [userAddresses, setUserAddresses] = useState([]);
  const [addressPopup, setAddressPopup] = useState(false);
  const [addressSearchPopup, setAddressSearchPopup] = useState(false);
  const [addressType, setAddressType] = useState("home");
  const [houseText, setHouseText] = useState("");
  const [landmarkText, setLandmarkText] = useState("");
  const [pincodeText, setPincodeText] = useState("");
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [deliveryArea, setDeliveryArea] = useState("");
  const { apiIP, apiToken } = SITE_CONFIG;
  const [formErrors, setFormErrors] = useState({});
  const [editAddressId, setEditAddressId] = useState(null);
  const [confirmDeletePopup, setConfirmDeletePopup] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  //Icon for Map marker
  const markerIcon = new L.Icon({
    iconUrl: markerIconUrl,
    iconSize: [28, 33],
  });

  
  useEffect(() => {
    // Function to handle user's location retrieval
    const handlePosition = async (position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      setDeliveryArea(response.data.display_name);
    };

    // Get user's current location
    navigator.geolocation.getCurrentPosition(handlePosition);
  }, []);

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

  const deleteUserAddress = async () => {
    if (!user || !addressToDelete) return;

    try {
      const updatedAddresses = userAddresses.filter(
        (address) =>
          address.title !== addressToDelete.title ||
          address.address !== addressToDelete.address ||
          address.house !== addressToDelete.house ||
          address.landmark !== addressToDelete.landmark ||
          address.pincode !== addressToDelete.pincode
      );

      const updatedAddressesString = JSON.stringify(updatedAddresses);
      const authToken = localStorage.getItem('AuthToken');
      
      const response = await axios.post(
        `${apiIP}/api/alluser/updateuseraddress`,
        {
          _id: user,
          address: updatedAddressesString,
        },
        {
          headers: {
            AuthToken: authToken,
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );

      if (response.data.success) {
        setDeliveryArea("");
        setHouseText("");
        setLandmarkText("");
        setPincodeText("");
        setAddressType("");
        getSingleUser();
      }
      setConfirmDeletePopup(false);
    } catch (error) {
      console.error("Error deleting user address:", error);
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

      setUserinfo(response.data[0]);
      const addressData = response.data[0].address;
      setUserAddresses(JSON.parse(addressData));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getSingleUser();
  }, []);

  return (
    <div className="lg:mx-[60px] px-[15px] bg-white">
      <ProfileBanner
        first_name={userinfo.first_name}
        last_name={userinfo.last_name}
        email={userinfo.email}
        mobile={userinfo.mobile}
      />
      <div className="flex">
        <ProfileSidebarMenu />
        <div className="w-full sm:w-3/4 p-8">
          <h2 className="text-lg font-bold mb-4">My Addresses</h2>
          <div className="relative flex flex-wrap items-start gap-2">
            <div
              onClick={() => setAddressPopup(true)}
              className="flex flex-col items-center justify-center p-[80px] rounded-lg cursor-pointer w-[250px] hover:bg-gray-200 transition-colors duration-300"
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
              <span className="text-black">Add New</span>
            </div>
            {userAddresses &&
              userAddresses.map((address, index) => (
                <div
                  key={index}
                  className="max-w-md bg-white rounded-lg p-6 mb-4 w-[250px]"
                >
                  <div className="text-lg font-bold uppercase ">
                    {address.title}
                  </div>

                  <div className="text-sm">
                    <div>
                      {address.house}, {address.landmark}, {address.address}
                    </div>
                    <div>{address.pincode}</div>
                  </div>

                  <div className="flex justify-start space-x-4 font-bold">
                    <button
                      onClick={() => {
                        setAddressPopup(true);
                        setDeliveryArea(address.address);
                        setHouseText(address.house);
                        setLandmarkText(address.landmark);
                        setPincodeText(address.pincode);
                        setAddressType(address.title);
                        setEditAddressId(index);
                      }}
                      className="text-red-600 px-2 py-1"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setConfirmDeletePopup(true);
                        setAddressToDelete(address);
                      }}
                      className="text-black px-1 py-1"
                    >
                      Delete
                    </button>
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
                            position={[location.latitude, location.longitude]}
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
                          type="number"
                          min={0}
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
                          type="number"
                          min={0}
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
                    <h1 className="font-semibold text-2xl">Search Location</h1>
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
            {confirmDeletePopup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 p-4 flex justify-center items-center z-30 h-[700px]">
                <div className="relative bg-white p-4 shadow-lg w-full max-w-lg h-[30%] flex flex-col items-center justify-center">
                  <h1 className="text-xl font-semibold mb-4">
                    Are you sure you want to delete this address?
                  </h1>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={deleteUserAddress}
                      className="bg-[#FF3547] text-white h-10 w-20 mr-5"
                    >
                      CONFIRM
                    </button>
                    <button
                      onClick={() => setConfirmDeletePopup(false)}
                      className="text-[#FF3547] h-10 w-20 border-2 border-[#FF3547] bg-white"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </div>
            )}{" "}
            {confirmDeletePopup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 p-4 flex justify-center items-center z-30 h-[700px]">
                <div className="relative bg-white p-4 shadow-lg w-full max-w-lg h-[30%] flex flex-col items-center justify-center">
                  <h1 className="text-xl font-semibold mb-4">
                    Are you sure you want to delete this address?
                  </h1>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={deleteUserAddress}
                      className="bg-[#FF3547] text-white h-10 w-20 mr-5"
                    >
                      CONFIRM
                    </button>
                    <button
                      onClick={() => setConfirmDeletePopup(false)}
                      className="text-[#FF3547] h-10 w-20 border-2 border-[#FF3547] bg-white"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;
