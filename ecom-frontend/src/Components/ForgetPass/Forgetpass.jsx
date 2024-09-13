import { useState } from "react";
function ForgetPass({ setOpenForgetPassword }) {
  const [isOpen, setIsOpen] = useState(true);

  const closePopup = () => {
    setIsOpen(false);
  };
  const handleOpenLogin = () => {
    setOpenForgetPassword(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-gray-800 bg-opacity-50 z-50 p-9">
      <div className="w-[76.5%] md:w-[65%] lg:w-[48.6%] xl:w-[40.5%] bg-white transform translate-y-[-5%] relative">
        <button
          onClick={closePopup}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          &#x2715;
        </button>
        <div className="flex items-center justify-center p-3 border-b border-gray-200">
          <h2 className="text-lg font-bold">Reset Password</h2>
        </div>

        <form noValidate className="mt-10 mr-5 ml-5  space-y-3">
          <div className="">
            <input
              type="email"
              name="email"
              spellCheck="false"
              autoCapitalize="off"
              required
              className="w-[100%] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 placeholder-bold"
              placeholder="Email"
            />
            <p className="text-red-500 hidden">Email is required</p>

            <div className="flex justify-end p-3">
              <p className="text-gray-600 text-md">
                or
                <span
                  className="text-red-500 hover:cursor-pointer"
                  onClick={handleOpenLogin}
                >
                  {" "}
                  login to your account
                </span>
              </p>
            </div>

            <div className="flex justify-center p-3 border-t border-gray-200">
              <button
                type="submit"
                className="bg-[#2BBBAD] text-white py-2 px-4"
              >
                SEND OTP
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgetPass;
