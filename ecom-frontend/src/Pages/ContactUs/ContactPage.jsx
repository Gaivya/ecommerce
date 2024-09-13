import React, { useEffect, useState } from 'react';
import { FaHome } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { FaEnvelope } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'; 
import SITE_CONFIG from '../../controller'; 

const ContactPage = () => {
  const [fullName, setFullName] = useState('');
  const [emailId, setEmailId] = useState('');
  const [message, setMessage] = useState('');
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${SITE_CONFIG.apiIP}/api/addcontactus`,
        {
          name:fullName, 
          email:emailId,
          message,   
        },
        {
          headers: {
            Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
          },
        }
      );
      console.log(response);
      notifySuccess('Message sent successfully!'); 

      setFullName('');
      setEmailId('');
      setMessage('');
    } catch (error) {
     
      setStatus('error');
      notifyError('There was an error sending your message. Please try again.');
      console.error('Error submitting form:', error);
    }
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


  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-0 mb-12">
      <h1 className="text-2xl font-semibold mb-2 mt-1 sm:text-left">Contact Us</h1>
      <hr className="hidden lg:block mt-1 mb-14" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              id="fullName"
              placeholder="Full Name"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-900"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="email"
              id="emailId"
              placeholder="Email ID"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-900"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
            />
          </div>
          <div>
            <textarea
              id="message"
              className="appearance-none border rounded w-full py-2 px-3 h-32 text-gray-900"
              value={message}
              placeholder="Write Message..."
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-[#BE0500] text-white focus:outline-none rounded-md"
            style={{ width: '165px', height: '45px' }}
          >
            SUBMIT
          </button>
        </form>

        <div className="mt-8 md:mt-0">
          <ul className="flex flex-col gap-4">
            <li className="flex items-center">
              <span className="text-[#BE0500] text-xl"><FaHome /></span>
              <span className="ml-2">Shop 13, 326 Great Western Hwy, Wentworthville</span>
            </li>
            <li className="flex items-center">
              <span className="text-[#BE0500] text-xl"><FaHome /></span>
              <span className="ml-2">New South Wales - Australia - 2145</span>
            </li>
            <li className="flex items-center">
              <span className="text-[#BE0500] text-xl"><FaEnvelope /></span>
              <span className="ml-2">contact@greenfarmmeatnswhalal.com.au</span>
            </li>
            <li className="flex items-center">
              <span className="text-[#BE0500] text-xl"><IoCall /></span>
              <span className="ml-2">431695219</span>
            </li>
          </ul>
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

export default ContactPage;
