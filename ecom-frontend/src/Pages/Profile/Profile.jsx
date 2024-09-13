import { useState, useEffect } from "react";
import ProfileBanner from "../../Components/ProfileBanner";
import ProfileSidebarMenu from "../../Components/ProfileSidebarMenu";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import SITE_CONFIG from "../../controller";
import { ToastContainer, toast } from "react-toastify";

import profileimg from "../../assets/maskable-icon.png";

const Profile = () => {
  const id = localStorage.getItem("User");

  const [userinfo, setUserinfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "male",
    mobile: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState({
    first_name: "",
    last_name: "",
  });


  const getSingleUser = async () => {
    try {
      const response = await axios.post(
        `${SITE_CONFIG.apiIP}/api/alluser/getuserbyid`,
        { _id: id },
        {
          headers: {
            Authorization: `Bearer ${SITE_CONFIG.apiToken}`,

          },
        }
      );
      setUserinfo(response.data[0]);
      setDisplayName({
        first_name: response.data[0].first_name,
        last_name: response.data[0].last_name,
      });
    } catch (error) {
      console.error("Error fetching userdata:", error);
    }
  };

  useEffect(() => {
    getSingleUser();
  }, []);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserinfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  const authToken = localStorage.getItem('AuthToken');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log(authToken);
      console.log(SITE_CONFIG.apiToken)
      const response = await axios.post(
        `${SITE_CONFIG.apiIP}/api/alluser/updateuser`,
        userinfo,
        {
          headers: {
            Authorization: `Bearer ${SITE_CONFIG.apiToken}`, // Bearer token
          },
        }
      );

      // Log the response or tokens if needed
      console.log(response);

      notifySuccess("Profile updated successfully!");

      // Update the display name
      setDisplayName({
        first_name: userinfo.first_name,
        last_name: userinfo.last_name,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      notifyError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className=" lg:mx-[60px] px-[15px] bg-white">
      {/*------------------------------------ Header Banner --------------------------------------*/}
      <ProfileBanner
        first_name={userinfo.first_name}
        last_name={userinfo.last_name}
        email={userinfo.email}
        mobile={userinfo.mobile}
      />

      <div className="flex ">
        {/*--------------------------------- Sidebar Menu --------------------------------------*/}
        <ProfileSidebarMenu />

        {/*------------------------ User Profile Information  -------------------------------*/}
        <div className="w-full sm:w-3/4 p-8">
          <h2 className="text-lg font-bold mb-4">User Informations</h2>
          <div className="mb-1 flex justify-center gap-4 sm:gap-6 relative">
            <div className="h-[110px] w-[110px] ml-[20px] border-4 border-transparent rounded-full relative">
              {/* <!---------------------- Profile Image ---------------------------> */}
              <img
                src={profileimg}
                alt="profileimg"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>

          <h2 className="text-center text-lg font-bold mb-2">
            {displayName.first_name} &nbsp;
            {displayName.last_name}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              {/*---------------------------------- First Name --------------------------------------*/}
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  className="mt-1 block w-full px-3 py-2 border rounded-md  sm:text-sm"
                  value={userinfo.first_name}
                  onChange={handleChange}
                />
              </div>

              {/*---------------------------------- Last Name ----------------------------*/}
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  className="mt-1 block w-full px-3 py-2 border rounded-md sm:text-sm"
                  value={userinfo.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 mb-4">
              {/*------------------------------------ Gender --------------------------------------*/}
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="gender"
                  className="mt-1 block w-full px-3 py-2 border rounded-md  sm:text-sm"
                  value={userinfo.gender}
                  onChange={handleChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* ------------------------ Phone Number ------------------------ */}
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="mobile"
                  className="mt-1 block w-full px-3 py-2 border rounded-md sm:text-sm"
                  value={userinfo.mobile}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* -------------------------- Save Button -------------------------- */}
            <button
              type="submit"
              style={{
                background: "#be0500",
                padding: "13px 34px",
                width: "115px",
              }}
              className="flex items-center rounded-sm shadow-md my-14 justify-center mx-auto"
              disabled={isLoading}
            >
              <span className="text-md text-white uppercase">
                {isLoading ? "Saving..." : "Save"}
              </span>
            </button>
          </form>
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
    </div>
  );
};

export default Profile;