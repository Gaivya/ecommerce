import { useState, useEffect, useRef } from "react";
import { FaMinus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./SingleProduct.css";
import SITE_CONFIG from "../../controller";
import { FaPlus } from "react-icons/fa";
import discountimg from "../../assets/discount.png";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCart,
  selectCartItemExists,
  selectItemQuantity,
  decrementItemQuantity,
} from "../../slices/cartSlice";

import axios from "axios";
const SingleProduct = () => {
  const { apiIP, imageUrl, apiToken } = SITE_CONFIG;
  const productData = JSON.parse(localStorage.getItem("productData") || "{}");

  let imageC = JSON.parse(productData.images).map((item) => imageUrl + item);
  imageC.unshift(imageUrl + productData.cover);
  const validImages = imageC.filter((url) => {
    return !url.endsWith("/images/") && url.trim() !== "";
  });
  const itemExists = useSelector((state) =>
    selectCartItemExists(state, productData._id)
  );
  const [selectedImage, setSelectedImage] = useState(1);
  const [variationOptions, setVariationOptions] = useState([]);
  const price = productData.sell_price;
  const [value, setValue] = useState(1);
  const [amount, setAmount] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState("");

  const dispatch = useDispatch();
  const quantity = useSelector((state) =>
    selectItemQuantity(state, productData._id)
  );
  const [localQuantity, setLocalQuantity] = useState(quantity || 1);
  const navigate = useNavigate();
  const storeId = useSelector((state) => state.store.selectedStore);

  // Function to handle image click
  const handleImageClick = (imageIndex) => {
    setSelectedImage(imageIndex);
  };

  const [similarProductData, setSimilarProductData] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const fetchProductData = async () => {
    try {
      const response = await axios.post(
        `${apiIP}/api/product/getproductbystoreid`,
        { store_id: storeId },
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
      setSimilarProductData(response.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    if (similarProductData && productData.category && productData.name) {
      const filteredProducts = similarProductData.filter(
        (product) =>
          product.category === productData.category &&
          product.name !== productData.name
      );
      setSimilarProducts(filteredProducts);
    }
  }, [similarProductData, productData.category]);

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    let parsedVariations = [];
    try {
      parsedVariations =
        typeof productData.variations === "string"
          ? JSON.parse(productData.variations)
          : productData.variations;
    } catch (error) {
      console.error("Failed to parse variations:", error);
    }

    if (Array.isArray(parsedVariations) && parsedVariations.length > 0) {
      const firstVariation = parsedVariations[0];
      if (firstVariation.type === "radio") {
        setVariationOptions(firstVariation.items || []);
        setSelectedVariation(firstVariation.items[0] || "");
      }
    }
  }, [productData.variations]);
  const cartItems = useSelector((state) => state.cart.items);

  // Function to check cart items and set value
  const checkCartItemQuantity = () => {
    const match = cartItems.find((item) => item.item._id === productData._id);
    if (match) {
      if (match.quantity > 1) {
        setValue(match.quantity);
      }
      if (match.weight > 1) {
        setValue(match.weight);
      }
    } else {
      setValue(1);
    }
  };

  useEffect(() => {
    if (cartItems.length !== 0) {
      checkCartItemQuantity();
    }
  }, []);

  const containerRef = useRef(null);

  const handleCategoryPageChange = (direction) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const scrollAmount =
        direction === "next" ? containerWidth / 2 : -containerWidth / 2;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleAddCartItem = () => {
    if (productData.size === "1") {
      dispatch(
        addItemToCart({
          item: productData,
          weight: value,
          quantity: localQuantity,
          amount: selectedVariation.price,
        })
      );
    } else {
      dispatch(
        addItemToCart({
          item: productData,
          weight: value,
          quantity: localQuantity,
          amount: amount,
        })
      );
    }
  };
  const handleUpdateCartItem = () => {
    dispatch(
      addItemToCart({
        item: productData,
        weight: value,
        quantity: localQuantity,
        amount: amount,
      })
    );
    setValue(1);
    navigate("/cart");
  };

  const handleOnClick = (item) => {
    localStorage.setItem("productData", JSON.stringify(item));
    checkCartItemQuantity();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleDecrease = () => {
    setLocalQuantity((prevQuantity) => {
      let newValue = prevQuantity;
      if (prevQuantity > 1) {
        newValue -= 1;
      } else if (prevQuantity === 1) {
        newValue = 1;
        dispatch(decrementItemQuantity(productData._id));
      }
      return newValue;
    });
  };
  const handleIncrease = () => {
    setLocalQuantity((prevQuantity) => prevQuantity + 1);
  };

  const getBorderStyle = (imageIndex) => {
    if (selectedImage === imageIndex) {
      return "2px solid #be0500";
    }
    return "1px solid rgb(211, 211, 211)";
  };

  useEffect(() => {
    if (productData.size === "0") {
      setAmount(
        (productData.discount === "0"
          ? parseFloat(price)
          : price - (price * productData.discount) / 100
        ).toFixed(2)
      );
    } else if (productData.size === "1") {
      setAmount(
        (productData.discount === "0"
          ? parseFloat(price)
          : price - (price * productData.discount) / 100
        ).toFixed(2)
      );
    } else {
      setAmount(
        (productData.discount === "0"
          ? value * price
          : value * (price - (price * productData.discount) / 100)
        ).toFixed(2)
      );
    }
  }, [value]);
  return (
    <div className="lg:px-[15px] lg:mx-[33px]">
      <div className=" lg:mt-[30px] flex flex-col  bg-white ">
        {/* {-------Product main details------------} */}
        <div className="flex flex-col md:flex-row  ">
          <div className="flex flex-col md:flex-row  lg:px-[15px]">
            <div className="hidden md:flex flex-col">
              {Array.isArray(validImages) &&
                validImages.map((item, index) => (
                  <img
                    key={index}
                    src={item}
                    alt={`Product Image ${index + 1}`}
                    className="w-[100px] h-[100px] mb-[20px] p-1 rounded-md"
                    style={{ border: getBorderStyle(index + 1) }}
                    onClick={() => {
                      handleImageClick(index + 1);
                    }}
                  />
                ))}
            </div>

            <div className="flex flex-col px-[15px] relative ">
              <img
                src={validImages[selectedImage - 1]}
                alt="Product Image"
                className="w-[490px] h-[490px] object-cover"
              />
              {productData.discount !== "0" && (
                <div
                  style={{ color: "rgb(128,128,128)" }}
                  className="absolute top-[20px] left-[20px] flex items-center justify-center p-[5px] "
                >
                  <img src={discountimg} className="h-16 w-16 relative" />
                  <p className=" absolute flex  flex-col items-center justify-center gap-[2px]  w-[35px]  rounded-md shadow-2xl text-sm shadow-white text-white ">
                    {productData.discount} %<span>OFF</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              color: "rgb(33, 37, 41)",
              lineHeight: "30px",
            }}
            className="  flex flex-col text-left  px-[15px] lg:px-[0] text-base mb-[16px]"
          >
            <h1
              style={{ fontSize: "20px" }}
              className="font-bold uppercase mb-[16px] pt-[5px]"
            >
              {productData.name}
            </h1>

            {/* Conditional message for stock status */}
            <div className="">
              <p
                style={{
                  color:
                    productData.in_stock === "0"
                      ? "rgb(248,59,83)"
                      : "rgb(0,161,0)",
                  fontSize: "16px",
                }}
                className="font-bold my-[5px]"
              >
                {productData.in_stock === "0" ? "Out of Stock" : "In Stock"}
              </p>
            </div>

            {(productData.size === "0" || productData.size === "2") && (
              <>
                <div
                  style={{
                    color: "rgb(248,59,83)",
                    fontSize: "20px",
                    fontWeight: "700",
                  }}
                  className="mb-[10px]"
                >
                  {productData.discount !== "0" ? (
                    <div>
                      <p className={`mb-2`}>
                        Price:
                        <span className="lg:mx-2 line-through">
                          ${productData.original_price} / Kg
                        </span>{" "}
                        <span className="lg:ml-2">
                          Price: $
                          {(
                            Number(productData.original_price) -
                            (Number(productData.sell_price) *
                              Number(productData.discount)) /
                              100
                          ).toFixed(2)}{" "}
                          / Kg
                        </span>
                      </p>
                    </div>
                  ) : (
                    <p className={`text-red-500 text-lg font-bold mb-2`}>
                      Price: ${productData.sell_price} / Kg
                    </p>
                  )}
                </div>

                {productData.discount !== "0" && (
                  <p
                    style={{
                      color: "rgb(248,59,83)",
                      fontSize: "20px",
                      fontWeight: "700",
                    }}
                    className="font-semibold mb-[10px]"
                  >
                    You Save :{" "}
                    <span
                      style={{
                        color: "rgb(0,161,0)",
                        marginRight: "10px",
                      }}
                    >
                      {productData.discount} %
                    </span>{" "}
                    Inclusive of all taxes
                  </p>
                )}
              </>
            )}

            <div className="flex flex-col items-left lg:w-[420px]   ">
              <div className="relative pt-1 w-full mb-[20px] pr-[20px] ">
                {productData.size === "0" && (
                  <>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <button
                        className="controlButton"
                        onClick={handleDecrease}
                      >
                        <FaMinus />
                      </button>
                      <span className="controlCount">{localQuantity}</span>
                      <button
                        className="controlButton"
                        onClick={handleIncrease}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </>
                )}

                {productData.size === "2" && (
                  <div className="slider-wrapper ">
                    <div className=" flex justify-between w-[90%] ">
                      {value >= 1 ? <span className="">0</span> : <span></span>}
                      <div
                        className="slider-value"
                        style={{
                          left: `calc(${((value - -2) * 100) / 19}% - 12px)`,
                        }}
                      >
                        {value} kg
                      </div>
                      {value <= 13 ? (
                        <span className="">15</span>
                      ) : (
                        <span></span>
                      )}
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="15"
                      step="0.1"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="slider-range h-1"
                      style={{
                        "--slider-progress": `${((value - 0) * 100) / 15}%`,
                      }}
                    />
                    <p
                      style={{
                        color: "rgb(0,128,0)",
                        fontSize: "20px",
                        fontWeight: "700",
                      }}
                      className="font-semibold mb-[20px]"
                    >
                      Amount :{" "}
                      <span
                        style={{
                          color: "rgb(0,161,0)",
                        }}
                        className="font-normal"
                      >
                        {" "}
                        $
                        {(
                          (Number(productData.sell_price) -
                            (Number(productData.sell_price) *
                              Number(productData.discount)) /
                              100) *
                          value
                        ).toFixed(2)}
                      </span>
                    </p>
                  </div>
                )}

                {productData.size === "1" && (
                  <div className="options-wrapper">
                    <select
                      id="underline_select"
                      className="border border-gray-300 text-sm w-full h-8"
                      value={JSON.stringify(selectedVariation)}
                      onChange={(e) => setSelectedVariation(JSON.parse(e.target.value))}
                    >
                      {variationOptions.map((item, index) => (
                        <option key={index} value={JSON.stringify(item)}>
                          {item.title} - $ {item.price}
                        </option>
                      ))}
                    </select>
                    <div className="quantity-controls mt-3 justify-start-important">
                      <button
                        className="quantity-controls-button"
                        onClick={handleDecrease}
                      >
                        <FaMinus />
                      </button>
                      <span className="quantity-controls-count">
                        {localQuantity}
                      </span>
                      <button
                        className="quantity-controls-button"
                        onClick={handleIncrease}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {itemExists && (
              <h2
                style={{ fontSize: "16px", height: "24px" }}
                className="font-bold mb-[20px]"
              >
                Added to The Cart
              </h2>
            )}
            {productData.in_stock == "1" &&
              productData.sell_price !== "0.00" && (
                <button
                  style={{
                    background: "#be0500",
                    padding: "5px",
                    width: "160px",
                  }}
                  className="flex items-center w-1/2 rounded mb-[10px] text-left"
                >
                  {/* Combined Text Label and + Symbol */}
                  <span
                    className="text-base text-white flex items-center justify-between pl-[10px]"
                    style={{ width: "160px" }}
                    onClick={
                      itemExists ? handleUpdateCartItem : handleAddCartItem
                    }
                  >
                    {itemExists ? (
                      <>Update the Cart</>
                    ) : (
                      <>
                        Add to Cart
                        <div
                          style={{ background: "rgba(255,255,255,0.3)" }}
                          className="flex items-center justify-center w-8 h-6 text-white rounded-full ml-2"
                        >
                          <span className="text-lg font-bold h-7 lg:h-8">
                            +
                          </span>
                        </div>
                      </>
                    )}
                  </span>
                </button>
              )}
          </div>
        </div>

        {/* {-------Product description------------} */}
        <div
          style={{
            color: "rgb(33, 37, 41)",
            borderTop: "1px solid rgb(211, 211, 211)",
            borderBottom: "1px solid rgb(211, 211, 211)",
          }}
          className="px-[15px] lg:px-0 py-[20px]"
        >
          <h2
            style={{ fontSize: "16px", height: "24px" }}
            className="font-bold"
          >
            Descriptions
          </h2>
          <p
            style={{ fontSize: "14px", fontWeight: "400" }}
            className="ml-[40px]"
          >
            {productData.descriptions}
          </p>
        </div>

        {/* {-------You May Also Like -----------} */}
        <div className="relative px-[15px] lg:px-0 py-[20px] mt-6 flex flex-col md:flex-row gap-4">
          {/* Grid for larger screens */}
          <div className="hidden lg:flex flex-col w-full">
            <h3 className="text-[16px] h-[24px] font-bold mb-[20px]">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
              {similarProducts.map((item, index) => (
                <Link
                  key={index}
                  onClick={() => handleOnClick(item)}
                  className="relative flex flex-col items-center text-center group"
                >
                  <img
                    src={`${SITE_CONFIG.apiIP}/images/${item.cover}`}
                    alt={item.name}
                    className="w-full h-[190px] object-cover transition-transform duration-300 ease-in-out"
                  />
                  <p
                    className="absolute bottom-0 left-0 w-full text-center items-center uppercase transition-transform duration-300 ease-in-out transform translate-y-full group-hover:translate-y-0 hover:bg-white "
                    style={{
                      height: "15%",
                      color: "rgb(108, 117, 125)",
                      background: "white",
                      fontSize: "16px",
                      fontWeight: "400px",
                    }}
                  >
                    {item.name}
                  </p>
                  {item.in_stock === "0" && (
                    <div
                      style={{ color: "rgb(128,128,128)" }}
                      className=" absolute top-[80px] left-[20px] flex items-center justify-center p-[5px] "
                    >
                      <p className=" h-[26px] flex items-center justify-center lg:w-[140px] rounded-md shadow-2xl text-xs shadow-white border border-[rgb(128,128,128)] bg-white">
                        Out of stock
                      </p>
                    </div>
                  )}
                  {item.discount !== "0" && (
                    <div
                      style={{ color: "rgb(128,128,128)" }}
                      className=" absolute top-[10px] left-[10px] flex items-center justify-center p-[5px] "
                    >
                      <p className=" h-[22px] flex items-center justify-center gap-[2px]  w-[35px]  rounded-md shadow-2xl text-xs shadow-white text-white border border-[rgb(128,128,128)] bg-orange-500">
                        {item.discount}
                        <span>%</span>
                      </p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Carousel for mobile view */}

          <div className="lg:hidden relative">
            <h3 className="text-[16px] h-[24px] font-bold mb-[20px]">
              You May Also Like
            </h3>
            <div className="relative flex items-center">
              <button
                style={{ color: "rgb(222, 226, 230)" }}
                className="absolute left-5 top-1/2 transform -translate-y-1/2  rounded-full z-10"
                onClick={() => handleCategoryPageChange("prev")}
                aria-label="Previous Slide"
                
              >
                &#10094;
              </button>
              <div
                className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                ref={containerRef}
              >
                {similarProducts.map((item, index) => (
                  <Link
                    key={index}
                    className="flex-shrink-0 w-[50%] p-2 snap-start"
                    onClick={() => handleOnClick(item)}
                  >
                    {/* <a href={item.link} className="block relative"> */}
                      <img
                        src={`${SITE_CONFIG.apiIP}/images/${item.cover}`}
                        alt={item.name}
                        className="w-full h-[190px] object-cover transition-transform duration-300 ease-in-out"
                      />
                      {item.in_stock === "0" && (
                        <div
                          style={{ color: "rgb(128,128,128)" }}
                          className=" absolute top-[80px] left-[20px] flex items-center justify-center p-[5px] "
                        >
                          <p className=" h-[26px] flex items-center justify-center w-[100px] lg:w-[140px] rounded-md shadow-2xl text-xs shadow-white border border-[rgb(128,128,128)] bg-white">
                            Out of stock
                          </p>
                        </div>
                      )}
                      {item.discount !== "0" && (
                        <div
                          style={{ color: "rgb(128,128,128)" }}
                          className=" absolute top-[10px] left-[10px] flex items-center justify-center p-[5px] "
                        >
                          <p className=" h-[22px] flex items-center justify-center gap-[2px]  w-[35px]  rounded-md shadow-2xl text-xs shadow-white text-white border border-[rgb(128,128,128)] bg-orange-500">
                            {item.discount}
                            <span>%</span>
                          </p>
                        </div>
                      )}
                    {/* </a> */}
                  </Link>
                ))}
              </div>
              <button
                style={{ color: "rgb(222, 226, 230)" }}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 rounded-full z-10"
                onClick={() => handleCategoryPageChange("next")}
                aria-label="Next Slide"
              >
                &#10095;
              </button>
            </div>
          </div>
        </div>

        <div className="px-[15px] lg:px-0 py-[20px] mt-6 flex flex-col md:flex-row gap-4"></div>
      </div>
    </div>
  );
};
export default SingleProduct;
