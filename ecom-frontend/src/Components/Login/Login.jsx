import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import SITE_CONFIG from "../../controller.js";
import Signup from "../Signup/Signup.jsx";
import Forgetpass from "../ForgetPass/Forgetpass.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login({ openLogin, setOpenLogin, setIslogin }) {
  const [openSignup, setOpenSignup] = useState(false);
  const [openForgetPassword, setOpenForgetPassword] = useState(false);

  useEffect(() => {
    let auth = localStorage.getItem("AuthToken");
    let user = localStorage.getItem("User");
    if (auth && user) {
      setIslogin(true);
      closePopup();
    } else {
      setIslogin(false);
    }
  }, [setIslogin]);

  const closePopup = () => {
    setOpenLogin(false);
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

  const handleOpenSignup = () => {
    setOpenSignup(true);
  };

  const handleOpenForgetPassword = () => {
    setOpenForgetPassword(true);
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const sendAuth = await axios.post(
        `${SITE_CONFIG.apiIPMongo}/api/auth/login`,
        {
          email: values.email,
          password: values.password,
        },
        {
          headers: {
            Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
          },
        }
      );
      const receive = await sendAuth.data;

      if (receive.success === true) {
        localStorage.setItem("AuthToken", receive.authToken);
        localStorage.setItem("User", receive.userid);

        setIslogin(true);
        window.location.reload();
        closePopup();
      } else {
        setErrors({ general: "Invalid Credentials" });
        notifyError("Invalid Credentials");
      }
    } catch (error) {
      notifyError("Invalid Credentials");
    }
    setSubmitting(false);
  };

  if (!openLogin) return null;
  if (openSignup)
    return (
      <Signup
        openSignup={openSignup}
        setOpenSignup={setOpenSignup}
        setIslogin={setIslogin}
        setOpenLogin={setOpenLogin}
      />
    );
  if (openForgetPassword)
    return (
      <Forgetpass
        openForgetPassword={openForgetPassword}
        setOpenForgetPassword={setOpenForgetPassword}
        setIslogin={setIslogin}
      />
    );

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-gray-800 bg-opacity-50 z-50 p-10">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="w-[95%] md:w-[500px] lg:w-[500px] xl:w-[500px] bg-white transform translate-y-[-5%] relative">
            <button
            type='button'
              onClick={closePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              &#x2715;
            </button>
            <div className="flex items-center justify-center p-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold">Login</h1>
            </div>

            <div className="p-4">
              <div className="space-y-3">
                <Field
                  type="email"
                  name="email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  placeholder="Email"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />

                <Field
                  type="password"
                  name="password"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  placeholder="Password"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />

                {errors.general && (
                  <p className="text-red-500 text-sm mt-1">{errors.general}</p>
                )}
              </div>

              <div className="flex flex-col items-end mt-4 space-y-2">
                <p
                  className="text-gray-600 hover:cursor-pointer"
                  onClick={handleOpenForgetPassword}
                >
                  Forgot Password?
                </p>
                <p className="text-gray-600">
                  or{" "}
                  <span
                    className="text-red-500 hover:cursor-pointer"
                    onClick={handleOpenSignup}
                  >
                    create an account
                  </span>
                </p>
              </div>
            </div>
            <div className="flex justify-center p-4 border-t border-gray-200">
              <button
                type="submit"
                className="bg-[#2BBBAD] text-white py-2 px-4 font-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "LOG IN"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="custom-toast"
      />
    </div>
  );
}

export default Login;
