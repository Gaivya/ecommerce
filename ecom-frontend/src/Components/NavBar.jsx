import { useEffect, useRef } from "react";
import { useState } from "react";
import logo from "../assets/logo.png";
import Paper from "@mui/material/Paper";
import { InputAdornment } from "@mui/material";
import { AiOutlineSearch } from "react-icons/ai";
import { styled } from "@mui/material/styles";
import {
  FaUser,
  FaShoppingCart,
  FaHome,
  FaLocationArrow,
  FaLanguage,
  FaSignOutAlt,
  FaClipboardList,
} from "react-icons/fa";
import { MdArrowDropDown, MdAccountCircle, MdEmail } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { RiInformation2Fill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { MdMenu } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import axios from "axios";
import SITE_CONFIG from "../controller";
import Login from "./Login/Login";
import CartPopup from "./CartPopup/CartPopup";
import { useDispatch, useSelector } from "react-redux";

import { clearCart, selectCartItemCount } from "../slices/cartSlice";
import { selectStore } from "../slices/storeslice";
import { setStoreName } from "../slices/storenameslice";
import PopUp from "./PopUp/PopUp";
import { setSubcategory } from "../slices/subcategoryslice";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [islogin, setIslogin] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openStoreDropdown, setOpenStoreDropdown] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [titles, setTitles] = useState({});
  const [storeData, setStoreData] = useState([]);
  const [selectedStore, setSelectedStore] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const cartItemCount = useSelector(selectCartItemCount);
  const storeId = useSelector((state) => state.store.selectedStore);
  let auth = localStorage.getItem("AuthToken");
  let user = localStorage.getItem("User");

  useEffect(() => {
    if (auth && user) {
      setIslogin(true);
    } else {
      setIslogin(false);
    }
  }, []);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleNavigation = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };
  const localStore = JSON.parse(localStorage.getItem("localStore"));

  const [cartPopupVisible, setCartPopupVisible] = useState(false);

  useEffect(() => {
    if (localStore) {
      dispatch(selectStore(localStore.id));
      dispatch(
        setStoreName({ name: localStore.name, address: localStore.address })
      );
    }
  }, [localStore]);

  const handleStoreChange = (data) => {
    setSelectedStore(data);
    if (cartItemCount > 0) {
      setCartPopupVisible(true);
    } else {
      localStorage.setItem("localStore", JSON.stringify(data));

      dispatch(selectStore(data.id));
      dispatch(setStoreName({ name: data.name, address: data.address }));
      setOpenStoreDropdown(false);
    }
  };

  const handleCartPopupOk = () => {
    localStorage.setItem("localStore", JSON.stringify(selectedStore));
    dispatch(selectStore(selectedStore.id));
    dispatch(
      setStoreName({ name: selectedStore.name, address: selectedStore.address })
    );
    dispatch(clearCart());
    setCartPopupVisible(false);
  };

  const handleCartPopupCancel = () => {
    setCartPopupVisible(false);
  };

  const [dropdowns, setDropdowns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, storeResponse] = await Promise.all([
          axios.get(`${SITE_CONFIG.apiIP}/api/menu`, {
            headers: { Authorization: `Bearer ${SITE_CONFIG.apiToken}` },
          }),
          axios.post(
            `${SITE_CONFIG.apiIP}/api/storedata`,
            {},
            {
              headers: { Authorization: `Bearer ${SITE_CONFIG.apiToken}` },
            }
          ),
        ]);

        const categories = JSON.parse(categoriesResponse.data[0].menu);
        setStoreData(storeResponse.data);
        const subcategoryPromises = categories.map((category) =>
          axios.get(
            `${SITE_CONFIG.apiIP}/api/subcategory?category=${category.name}`,
            {
              headers: { Authorization: `Bearer ${SITE_CONFIG.apiToken}` },
            }
          )
        );

        const subcategoryResponses = await Promise.all(subcategoryPromises);
        const dropdownsData = [];

        categories.forEach((category, index) => {
          const subcategories = subcategoryResponses[index].data.filter(
            (item) => item.status === "active"
          );

          dropdownsData.push({
            id: category._id,
            title: category.name,
            items: subcategories.map((sub) => ({
              text: sub.name,
              index: index,
              href: `/catalogue`,
            })),
          });
        });
        setDropdowns(dropdownsData);

        const initialTitles = {};
        dropdownsData.forEach((dropdown) => {
          initialTitles[dropdown.id] = dropdown.title;
        });
        setTitles(initialTitles);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleLinkClick = (event, item, dropdownId, categoryName) => {
    event.preventDefault();
    dispatch(
      setSubcategory({
        name: item.text,
        category: categoryName,
      })
    );
    setOpenDropdown(null);
    navigate(item.href, {
      state: {
        itemData: item,
        dropdownId,
        categoryName,
      },
    });
  };

  const Dropdown = ({ items, dropdownId, categoryName }) => (
    <div className="absolute right-0 min-w-48 mt-2 z-50 origin-top-right bg-black text-white text-sm font-thin">
      {items.map((item, index) => (
        <div
          key={index}
          className="block p-2 text-white hover:bg-[rgb(117,117,117)]"
          onClick={(e) => handleLinkClick(e, item, dropdownId, categoryName)}
        >
          {item.text}
        </div>
      ))}
    </div>
  );

  const activeStore = storeData.filter(method => method.status === 'active');
  console.log(storeData)
  const StoreDropDown = () => (
    <div className="absolute right-0 min-w-48 mt-2 z-50 origin-top-right bg-black text-white text-sm font-thin">
      {activeStore &&
        activeStore.map((item, index) => (
          <Link
            key={index}
            className="block p-2 text-white"
            onClick={() => handleStoreChange(item)}
          >
            {item.name}
          </Link>
        ))}
    </div>
  );
  const handleLogin = () => {
    setOpenLogin(true);
  };
  const handleLogout = () => {
    localStorage.removeItem("AuthToken");
    localStorage.removeItem("User");
    navigate("/home");
    window.location.reload();
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.post(
          `${SITE_CONFIG.apiIP}/api/product/getproductbystoreid`,
          { store_id: storeId },
          {
            headers: {
              Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
            },
          }
        );
        setAllProducts(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [storeId]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(allProducts);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const properties = ['name', 'type', 'brand', 'category', 'author', 'description', 'gender'];

    const newFilteredData = allProducts.filter(item =>
      properties.some(prop =>
        item[prop] && item[prop].toLowerCase().includes(searchTermLower)
      )
    );
    setFilteredData(newFilteredData);
  }, [searchTerm, allProducts]);
  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOnClick = (products) => {
    localStorage.setItem("productData", JSON.stringify(products));

    setIsVisible(false);
    setSearchTerm("");
    navigate("/product");
  };

  const handlePrivatePage = (e) => {
    if (islogin) {
      navigate(`/${e.target.name}`);
    } else {
      setOpenLogin(true);
    }
    setIsMenuOpen(false);
  };

 
   const dropdownRef = useRef(null);
  const dropdownRef2 = useRef([]);
  const dropdownRef3 = useRef(null);

  const handleClickOutsideOrScroll = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideOrScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideOrScroll);
    };
  }, []);

  const handleClickOutsideOrScroll2 = (event) => {
    const isClickInsideDropdowns = dropdownRef2.current.some((ref) =>
      ref?.contains(event.target)
    );

    if (!isClickInsideDropdowns) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideOrScroll2);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideOrScroll2);
    };
  }, []);

  return (
    <>
      {!localStore && (
        <PopUp storeData={activeStore} handleStoreChange={handleStoreChange} />
      )}

      <Login
        openLogin={openLogin}
        setOpenLogin={setOpenLogin}
        setIslogin={setIslogin}
      />

      {cartPopupVisible && (
        <CartPopup onOk={handleCartPopupOk} onCancel={handleCartPopupCancel} />
      )}

      <nav
        style={{ background: "#b91C1C" }}
        className=" no-scrollbar  lg:bg-gray-100 fixed z-30 w-full "
      >
        <div className="lg:bg-gray-100  h-[58px] lg:h-[70px] mx-auto flex items-center justify-between lg:justify-evenly px-[12px] lg:px-[40px] gap-20  ">
          {/* Toggle Icon for Mobile View */}
          <button
            className="lg:hidden p-2 text-white lg:text-black"
            onClick={handleMenuToggle}
          >
            <MdMenu className="text-xl" />
          </button>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-0 left-0 w-full h-screen p-[20px] z-10  bg-gray-100 shadow-lg divide-y divide-gray-200">
              <div className="text-base ">
                <button
                  className=" text-gray-600 hover:text-gray-800 h-[20px] w-[20px] mb-[20px]"
                  onClick={handleMenuToggle}
                >
                  <RxCross1 className="text-xl" />
                </button>
                <Link
                  to="/home"
                  className=" flex items-center gap-2  p-[10px] text-gray-800 hover:bg-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaHome />
                  Home
                </Link>
                {/* <Link
                  name="profile"
                  className=" flex items-center gap-2  p-[10px] text-gray-800 hover:bg-gray-200"
                  onClick={handlePrivatePage}
                >
                  <MdAccountCircle />
                  Profile
                </Link> */}
                <Link
                  to='orders'
                  name="orders"
                  className="flex items-center gap-2 p-[10px] text-gray-800 hover:bg-gray-200"
                  onClick={handlePrivatePage}
                >
                  <FaClipboardList />
                  Orders
                </Link>
                <Link
                  to='address'
                  name="address"
                  className="flex items-center gap-2  p-[10px] text-gray-800 hover:bg-gray-200"
                  onClick={handlePrivatePage}
                >
                  <FaLocationArrow />
                  Address
                </Link>
                {/* <Link
                  to="/"
                  className="flex items-center gap-2  p-[10px] text-gray-800 hover:bg-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaLanguage />
                  Language
                </Link> */}
                <Link
                  to="/contact"
                  className="flex items-center gap-2  p-[10px] text-gray-800 hover:bg-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MdEmail />
                  Contact Us
                </Link>
                {/* <Link
                  to="/"
                  className="flex items-center gap-2  p-[10px] text-gray-800 hover:bg-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <RiInformation2Fill />
                  About
                </Link> */}
                <Link
                  className="flex items-center gap-2  p-[10px] text-gray-800 hover:bg-gray-200"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  Logout
                </Link>
              </div>
            </div>
          )}

          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0 ">
            <Link to="/home">
              <img
                src={logo}
                alt="Logo"
                className="h-[38px] lg:h-[60px] lg:pl-[55px]"
              />
            </Link>
          </div>

          {/* Search Form */}
          <div className="flex-grow h-[40px] hidden lg:flex lg:justify-center ">
            <form className="relative">
            <input
                type="search"
                placeholder="Search for products"
                className="form-input block min-w-[420px] px-3 py-1 h-[40px] rounded-md placeholder-gray-500 sm:text-sm pr-10"  // Add padding to accommodate the icon
                value={searchTerm}
                onChange={handleSearch}
                onClick={() => setIsVisible(true)}
              />
              <AiOutlineSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              {searchTerm.length > 0 && isVisible && (
              <div className="absolute top-10 -left-3 w-[350px] bg-white sm:w-[400px] md:w-[600px] overflow-y-auto max-h-[500px] z-50 shadow-2xl border-spacing-8">
              <div className="space-y-0">
                {filteredData.length === 0 ? (
                  <h6 className="flex justify-start gap-2 items-center text-sm max-h-[500px] p-2 px-4 border-b border-gray-200">
                    Product Not Found
                  </h6>
                ) : (
                  filteredData.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleOnClick(product)}
                      className="block cursor-pointer"
                    >
                      <div className="flex justify-start gap-2 items-center max-h-[500px] p-2 px-4 border-b border-gray-200">
                        <img
                          src={`${SITE_CONFIG.imageUrl}${product.cover}`}
                          alt={product.name}
                          className="w-4 h-4"
                        />
                        <p className="text-sm">
                          {product.name.slice(0, 35)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
              )}
            </form>
          </div>

          {/* Account and Cart Links */}
          <div className="flex items-center  text-sm font-normal text-black gap-1 ">
            <div className="relative">
              <button type="button" className="inline-flex items-center gap-2 ">
                {islogin ? (
                  <a
                    className="inline-flex items-center gap-2"
                    onClick={handleDropdownToggle}
                  >
                    <FaUser
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate("/profile");
                      }}
                      className="text-base text-white inline lg:hidden"
                    />
                    <FaUser className=" text-black lg:text-black hidden lg:inline" />
                    <p className="hidden lg:inline">Account</p>
                    <MdArrowDropDown className=" hidden lg:inline" />
                  </a>
                ) : (
                  <a
                    className="inline-flex items-center gap-2  lg:text-black"
                    onClick={handleLogin}
                  >
                    <FaUser
                      onClick={handleLogin}
                      className="text-base text-white inline lg:hidden"
                    />
                    <FaUser className="text-black lg:text-black hidden lg:inline" />
                    <p className="hidden lg:inline">Login/Register</p>
                  </a>
                )}
              </button>

              {/* Dropdown Menu */}
              {islogin && (
                <div
                  ref={dropdownRef}
                  className={`absolute right-0 w-48 mt-2 z-10 origin-top-right bg-black divide-y shadow-lg ring-1 ring-black ring-opacity-5 text-white ${
                    isDropdownOpen ? "block" : "hidden"
                  }`}
                >
                  <div className="p-1">
                    <div
                      onClick={() => handleNavigation("/profile")}
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                    >
                      Settings
                    </div>
                    <div
                      onClick={() => handleNavigation("/orders")}
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                    >
                      Orders
                    </div>
                    <hr className="my-1 border-gray-200" />
                    <div
                      onClick={() => handleNavigation("/address")}
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                    >
                      Address
                    </div>
                    <a
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                    >
                      Logout
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Button for big screens (bove 1024px) */}
            <Link to={`/cart`} className="lg:pr-[40px]">
              <button className="hidden lg:inline-flex items-center gap-2 text-black relative p-2  ">
                <span>
                  <FaShoppingCart />
                </span>
                Cart
                {cartItemCount > 0 && (
                  <span className="absolute top-0 left-0 bg-red-500 text-light rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Button for small screens (below 1024px) */}
            <Link to={`/cart`}>
              <button className="inline-flex  lg:hidden items-center relative text-white">
                <span className="text-base ">
                  <FaShoppingCart />
                </span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -left-1 bg-black text-white rounded-full text-xs w-[14px] h-[14px] flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </Link>
          </div>
        </div>

        {/* Search the produucts -2 */}
        <div className="bg-white  h-[40px]  text-base lg:hidden text-black">
          <form className="relative">
          <input
          type="search"
          placeholder="Search for products"
          className="form-input block min-w-[460px] px-3 py-1 h-[40px] rounded-md placeholder-gray-500 sm:text-sm pr-8"
          value={searchTerm}
          onChange={handleSearch}
          onClick={() => setIsVisible(true)}
        />
        <AiOutlineSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />

            {searchTerm.length > 0 && isVisible && (
              <div className=" absolute top-10  w-[360px] bg-white sm:w-[400px] md:w-[600px] overflow-y-auto max-h-[600px] z-50 shadow-2xl border-spacing-8">
                <div className="space-y-0">
                  {filteredData.length === 0 ? (
                    <h6 className="flex justify-start gap-2 items-center text-sm max-h-[500px] p-2 px-4 border-b border-gray-200">
                      Product Not Found
                    </h6>
                  ) : (
                    filteredData.map((products) => (
                      <div
                        key={products._id}
                        onClick={() => handleOnClick(products)}
                        className="block cursor-pointer"
                      >
                        <div className="flex justify-start gap-2 items-center max-h-[500px] p-2 px-4 border-b border-gray-200">
                          <img
                            src={`http://13.127.97.224/images/${products.cover}`}
                            alt={products.name}
                            className="w-4 h-4"
                          />
                          <p className="text-sm">
                            {products.name.slice(0, 35)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* store selection */}
        <div className="hidden lg:flex bg-gray-100 lg:bg-custom-red h-[50px] relative space-x-4  items-center justify-between lg:justify-evenly text-white  text-base px-[40px]">
          <div className="relative " ref={dropdownRef3}>
            <button
              className="flex items-center gap-2 text-sm font-thin"
              onClick={() => {
                setOpenStoreDropdown((prev) => !prev);
                console.log("clickend");
              }}
            > <FaLocationDot />
              {localStore ? localStore.name : "Select Store"}
              <MdArrowDropDown />
            </button>
            {openStoreDropdown && <StoreDropDown />}
          </div>

          {dropdowns.map((dropdown, index) => (
            <div
              key={index}
              className="relative "
              ref={(el) => (dropdownRef2.current[index] = el)}
            >
              <button
                className="flex items-center gap-2 text-sm font-thin"
                onClick={() =>
                  setOpenDropdown(index === openDropdown ? null : index)
                }
              >
                {titles[dropdown.id]}
                <MdArrowDropDown />
              </button>
              {openDropdown === index && (
                <Dropdown
                  items={dropdown.items}
                  dropdownId={dropdown.id}
                  categoryName={titles[dropdown.id]}
                />
              )}
            </div>
          ))}
        </div>

        <div className="lg:hidden bg-stone-300 lg:bg-custom-red h-[40px] relative  mx-auto px-[10px] py-[5px] text-base  items-center justify-between  text-gray-500 ">
          <div className="relative " ref={dropdownRef3}>
            <button
              className="flex items-center text-md font-bold"
              onClick={() => setOpenStoreDropdown((prev) => !prev)}
            > <FaLocationDot />
              {localStore ? localStore.name : "Select Store"}
              <MdArrowDropDown />
            </button>
            {openStoreDropdown && <StoreDropDown />}
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
