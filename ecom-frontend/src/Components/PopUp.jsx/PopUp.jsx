import { useState } from "react";
import { Link } from "react-router-dom";

function PopUp() {
  const [isOpen, setIsOpen] = useState(true);

  const closePopup = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed top-[10%] left-1/2 transform -translate-x-1/2 shadow-md bg-white border border-white w-[40%] max-w-2xl"
        style={{ border: '1px solid white' }}
      >
        <button
          onClick={closePopup}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &#x2715; {/* X symbol */}
        </button>
        <p className="ml-4 mt-2 mb-2 text-gray-500">Choose the Nearest Store</p>
        <hr />
        <div className="flex flex-col md:flex-row justify-center gap-6 p-4">
          <div className="bg-white border border-gray-300 p-4 w-full md:w-60 sm:w-60 relative group">
            <div className="mb-4">
              <img
                src="https://media.gettyimages.com/id/172916013/photo/roast-chicken-isolated-on-white-background.jpg?s=612x612&w=gi&k=20&c=aZy15FWaw8_DnKwxrBaE88Qq1-KWppvUzrFgUiEs04c="
                alt="Store 1"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-[#6c757d]">Green Farm Products Wentworthville NSW</p>
              <p className="text-sm text-[#6c757d]">shop 13/326 Great Western Hwy,..</p>
              <Link>
                <button className="absolute left-1/2 transform -translate-x-1/2 bg-[#be0500] py-1 px-3 text-sm opacity-0 group-hover:opacity-100 group-hover:translate-y-2 transition-all duration-300 w-auto text-white ">
                  Select
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-white border border-gray-300 p-4 w-full md:w-60 relative group">
            <div className="mb-4">
              <img
                src="https://media.gettyimages.com/id/172916013/photo/roast-chicken-isolated-on-white-background.jpg?s=612x612&w=gi&k=20&c=aZy15FWaw8_DnKwxrBaE88Qq1-KWppvUzrFgUiEs04c="
                alt="Store 2"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-[#6c757d]">Green Farm Products Dee Why NSW</p>
              <p className="text-sm text-[#6c757d]">838A Pittwater Rd Dee Why NSW ..</p>
              <Link>
                <button className="absolute left-1/2 transform -translate-x-1/2 bg-[#be0500] py-1 px-3 text-sm opacity-0 group-hover:opacity-100 group-hover:translate-y-2 transition-all duration-300 w-auto text-white">
                  Select
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PopUp;
