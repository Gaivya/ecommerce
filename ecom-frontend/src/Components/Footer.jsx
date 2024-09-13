import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import vis_icon from "../assets/visa_icon.png";
import American_Express_icon from "../assets/American_icon.png";
import MasterCard_icon from "../assets/Mastercard_icon2.png";
import { useMediaQuery } from "react-responsive";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FaLocationDot } from "react-icons/fa6";
import axios from "axios";
import SITE_CONFIG from "../controller";
import './Footer.css'
import { Link, useNavigate } from "react-router-dom";
import Login from "./Login/Login";

const Footer = () => {
  const [activePolicies, SetActivePolicies] = useState([]);
  const [openLogin, setOpenLogin] = useState(false);
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  let auth = localStorage.getItem("AuthToken");
  let user = localStorage.getItem("User");
  const [isLoggedIn, setIsLoggedIn] = useState();
  useEffect(() => {
    if (auth && user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const fetchpolicies = async () => {
    try {
      const response = await axios.get(`${SITE_CONFIG.apiIP}/api/policies`, {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
        },
      });
      const active = response.data.filter(
        (policy) => policy.status === "active"
      );
      SetActivePolicies(active);
    } catch (error) {
      console.error("Error fetching policies:", error);
    }
  };

  useEffect(() => {
    fetchpolicies();
  }, []);

  const handleNavigation = (policy) => {
    const url = policy.name;
    if (url) {
      navigate(`/policy/${url}`, { state: { policy } });
    } else {
      console.error("No URL mapped for policy:", policy);
    }
  };
  const handleShowLogin = () => {
    setOpenLogin(true);
  };
  const handlePrivatePage = (e) => {
    if (isLoggedIn) {
      navigate(`/${e.target.name}`);
    } else {
      handleShowLogin(true);
    }
  };

  const [email, setEmail] = useState("");

  const subscribeEmail = async () => {
    try {
      await axios.post(
        `${SITE_CONFIG.apiIP}/api/subscriber/addsubscriber`,
        { email: email, timestamp: new Date().toISOString() },

        {
          headers: {
            Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
          },
        }
      );
      notifySuccess("Subscription successful!");
      setEmail("");
    } catch (error) {
      console.error("Subscription failed:", error);
      notifyError("Subscription failed. Please try again.");
    }
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    subscribeEmail();
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

  return (
    <>
      {openLogin && (
        <Login
          openLogin={openLogin}
          setOpenLogin={setOpenLogin}
          setIslogin={setIsLoggedIn}
        />
      )}

      <footer
        style={{ backgroundColor: "rgb(222, 226, 230)" }}
        className=" w-full text-center text-neutral-600   lg:text-left pt-[50px]"
      >
        <div className="text-center  mt-[48px]  lg:mx-[50px] px-[15px] ">
          <div className="grid-1 grid lg:gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* <!-- green  section --> */}
            <div className="mb-[16px] lg:w-[305px] lg:px-[17px] text-sm  lg:text-left">
              <h6 className=" flex items-center justify-center lg:justify-start  mb-[16px]  uppercase ">
                <a href="/home">
                  <img src={logo} alt="Logo" className="h-[74px] w-[200px] " />
                </a>
              </h6>
              <span className=" flex items-center justify-center lg:justify-start mb-1 whitespace-nowrap text-sm ">
                <FaLocationDot className="text-black " /> Shop 13, 326 Great
                Western Hwy,
                <span className=" lg:hidden">Wentworthville</span>
              </span>
              <p className="mb-[20px] text-sm hidden lg:inline-block ">
                Wentworthville
              </p>
              <p className="flex mb-[20px] text-sm items-center justify-center  lg:justify-start">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-2 h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                    clipRule="evenodd"
                  />
                </svg>
                431695219
              </p>
              <p className="flex lg:flex items-center text-sm   justify-center lg:justify-start lg:items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className=" h-5 w-5 text-black"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
                contact@greenfarmmeatnswhalal.com.au
              </p>
            </div>

            {/* <!-- Policies section --> */}
            <div className="mb-[24px] px-[15px] lg:ml-[20px] lg:text-left">
              <h6 className="mb-[10px] flex justify-center lg:justify-left font-bold md:justify-start text-black">
                Useful Links
              </h6>

              <a
                onClick={handlePrivatePage}
                name={`profile`}
                className="mb-[10px] flex justify-center lg:justify-left  md:justify-start text-neutral-600  text-sm cursor-pointer"
              >
                User Account
              </a>
              <Link
                to={"/contact"}
                className="mb-[10px] flex justify-center lg:justify-left  md:justify-start text-neutral-600  text-sm cursor-pointer"
              >
                Contact
              </Link>

              {activePolicies.map((policy) => (
                <p className="mb-[10px]" key={policy._id}>
                  <a
                    className="text-neutral-600  text-sm cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(policy);
                    }}
                  >
                    {policy.name}
                  </a>
                </p>
              ))}
            </div>

            {/* <!-- Useful links section --> */}
            <div className="  mb-[24px] px-[15px]  lg:text-left">
              <h6 className="mb-[10px]  flex justify-center font-bold  md:justify-start   text-black">
                Useful Links
              </h6>
              <p className="mb-[10px] ">
                <a
                  href="/home"
                  className="text-neutral-600   text-sm cursor-pointer"
                >
                  Home
                </a>
              </p>

              <p className="mb-[10px] ">
                <a
                  name="orders"
                  onClick={handlePrivatePage}
                  className="text-neutral-600  text-sm cursor-pointer"
                >
                  Orders
                </a>
              </p>
              <p className="mb-[10px] ">
                <Link to="/cart" className="text-neutral-600   text-sm">
                  Cart
                </Link>
              </p>
            </div>
            {/* <!-- Contact section --> */}
            <div className=" mb-[24px]   lg:text-left ">
              <h6 className="  flex justify-center font-bold mb-2  md:justify-start  text-black">
                Join Our Newsletter Now
              </h6>

              <p className="mb-[20px] flex items-center justify-center md:justify-start   text-sm">
                Get E-mail updates about our latest shop and special offers.
              </p>
              <div className="flex flex-col items-center md:items-start w-full lg:w-[300px]">
                <form
                  className="flex flex-col md:flex-row md:items-center w-full max-w-md md-2 lg:mx-0"
                  onSubmit={handleSubmit}
                >
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleEmail}
                    placeholder="Enter your E-mail"
                    className="w-3/4 px-2 lg:px-1 py-[14px] focus:ring-2 outline-none focus:ring-blue-200"
                  />
                  <button
                    type="submit"
                    className="py-[14px] w-1/3 lg:w-1/2 border-2 border-red-700 text-white text-sm font-semibold bg-red-700 handlespace"
                  > 
                    SUBSCRIBE
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-gray-100 "></div>
        {/* <!--Copyright section--> */}
        <div
          className={`lg:mx-[54px] py-[9px] px-[24px] text-center border  ${
            isDesktop ? "flex justify-center items-center " : "flex-col"
          }`}
        >
          <div
            className={`${isDesktop ? "flex-grow text-left " : " text-left"} `}
          >
            <span className="text-xs">
              Copyright © 2024 All rights reserved
            </span>
            <a
              className="font-semibold text-neutral-600 "
              href="https://tw-elements.com/"
            ></a>
          </div>

          <div
            className={`${
              isDesktop
                ? "flex  gap-2 items-center"
                : "flex justify-center items-center "
            }`}
          >
            <img src={vis_icon} alt="ATM Card 1" className="h-10" />
            <img
              src={American_Express_icon}
              alt="ATM Card 2"
              className="h-10"
            />
            <img src={MasterCard_icon} alt="ATM Card 3" className="h-10" />
          </div>
        </div>
      </footer>
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
export default Footer;
