import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Card.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCart,
  decrementItemQuantity,
  incrementItemQuantity,
  selectCartItemExists,
  selectItemQuantity,
} from "../../slices/cartSlice";
import { FaShoppingBasket } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import SITE_CONFIG from "../../controller";
const Card = ({ item }) => {
  const navigate = useNavigate();
  const [weight, setWeight] = useState(1);
  const [amount, setAmount] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState("");
  const [variationOptions, setVariationOptions] = useState([]);
  const itemExists = useSelector((state) =>
    selectCartItemExists(state, item._id)
  );
  const quantity = useSelector((state) => selectItemQuantity(state, item._id));
  const location = useLocation();
  const isHome = location.pathname === "/home";
  const dispatch = useDispatch();
  const { imageUrl } = SITE_CONFIG;

  useEffect(() => {
    let parsedVariations = [];
    try {
      parsedVariations =
        typeof item.variations === "string"
          ? JSON.parse(item.variations)
          : item.variations;
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
  }, [item.variations]);

  const handleAddClick = () => {
    dispatch(
      addItemToCart({
        item: item,
        weight: weight,
        quantity: quantity,
        amount: amount,
      })
    );
  };
  const handleAddClickVariation = () => {
    dispatch(
      addItemToCart({
        item: item,
        weight: weight,
        quantity: quantity,
        amount: selectedVariation.price,
      })
    );
  };

  const handleAddHomeClick = () => {
    localStorage.setItem("productData", JSON.stringify(item));
    navigate("/product");
  };
  const handleOnClick = () => {
    localStorage.setItem("productData", JSON.stringify(item));
    navigate("/product");
  };
  const handleIncrease = () => {
    dispatch(incrementItemQuantity(item._id));
  };

  const handleDecrease = () => {
    dispatch(decrementItemQuantity(item._id));
  };

  const handleSliderChange = (event) => {
    setWeight(event.target.value);
  };

  useEffect(() => {
    if (item.size === "2") {
      setAmount(
        (
          weight *
          (item.discount === "0"
            ? item.sell_price
            : item.sell_price - (item.sell_price * item.discount) / 100)
        ).toFixed(2)
      );
    } else if (item.size === "0") {
      setAmount(
        item.discount === "0"
          ? parseFloat(item.sell_price).toFixed(2)
          : (item.sell_price - (item.sell_price * item.discount) / 100).toFixed(
              2
            )
      );
    } else if (item.size === "1") {
      setAmount(
        item.discount === "0"
          ? parseFloat(selectedVariation.price).toFixed(2)
          : (
              selectedVariation.price -
              (selectedVariation.price * item.discount) / 100
            ).toFixed(2)
      );
    }
  }, [weight, item.sell_price]);
  return (
    <div className="card-container payload relative">
      <NavLink className="mb-4 ">
        <img
          src={`${imageUrl}${item.cover}`}
          alt={item.name}
          className="card-image"
          onClick={handleOnClick}
        />
        {item.in_stock === "0" && (
          <div
            style={{ color: "rgb(128,128,128)" }}
            className=" absolute top-[100px] left-[40px] flex items-center justify-center p-[5px] "
          >
            <p className=" h-[26px] flex items-center justify-center w-[80px] lg:w-[180px] rounded-md shadow-2xl text-xs shadow-white border border-[rgb(128,128,128)] bg-white">
              Out of stock
            </p>
          </div>
        )}
        {item.discount !== "0" && (
          <div
            style={{ color: "rgb(128,128,128)" }}
            className=" absolute top-[20px] left-[20px] flex items-center justify-center p-[5px] "
          >
            <p className=" h-[22px] flex items-center justify-center gap-[2px]  w-[35px]  rounded-md shadow-2xl text-xs shadow-white text-white border border-[rgb(128,128,128)] bg-orange-500">
              {item.discount}
              <span>%</span>
            </p>
          </div>
        )}
      </NavLink>
      <div className="textcenterclass text-center group cardbottom ">
        <p className="card-title">{item.name}</p>
        {item.size === "0" && !isHome && item.in_stock !== "0" && (
          <>
            <p className="card-price font-bold">${item.sell_price}</p>
            {quantity === 0 ? (
              <button
                className="add-button flex justify-center items-center"
                onClick={handleAddClick}
              >
                <span className="flex justify-center items-center gap-1 text-xs p-1 shadow-lg">
                  <FaShoppingBasket /> ADD
                </span>
              </button>
            ) : (
              <div className="quantity-controls">
                <button
                  className="quantity-controls-button"
                  onClick={handleDecrease}
                >
                  <FaMinus />
                </button>
                <span className="quantity-controls-count">{quantity}</span>
                <button
                  className="quantity-controls-button"
                  onClick={handleIncrease}
                >
                  <FaPlus />
                </button>
              </div>
            )}
          </>
        )}
        {/* slider   */}
        {item.size === "2" && !isHome && item.in_stock !== "0" && (
          <div className="slider-wrapper">
            <div className=" flex justify-between ">
              {weight >= 1 ? <span className="">0</span> : <span></span>}
              <div
                className="slider-value"
                style={{
                  left: `calc(${((weight - -3) * 100) / 18}% - 12px)`,
                }}
              >
                {weight} kg
              </div>
              {weight <= 13 ? <span className="">15</span> : <span></span>}
            </div>
            <input
              type="range"
              min="0.1"
              max="15"
              step="0.1"
              value={weight}
              onChange={handleSliderChange}
              className="slider-range"
              style={{
                "--slider-progress": `${((weight - 0) * 100) / 15}%`,
              }}
            />
          
            <p className="text-sm text-[#BE0500] font-bold">
              Amount: ${(item.sell_price * weight).toFixed(2)}
            </p>
            <button
              className="add-button flex justify-center items-center shadow-lg "
              onClick={() => {
                handleAddClick();
              }}
            >
              {itemExists ? (
                <span className="flex justify-center items-center gap-1 text-xs p-1">
                  <FaShoppingBasket /> UPDATE
                </span>
              ) : (
                <span className="flex justify-center items-center gap-1 text-xs p-1">
                  <FaShoppingBasket /> ADD
                </span>
              )}
            </button>
          </div>
        )}
        {/* selector   */}
        {item.size === "1" &&
          !isHome &&
          item.in_stock !== "0" &&
          variationOptions.length > 0 && (
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
              {quantity === 0 ? (
                <button
                  className="add-button flex justify-center items-center shadow-lg"
                  onClick={handleAddClickVariation}
                >
                  <FaShoppingBasket /> ADD
                </button>
              ) : (
                <div className="quantity-controls">
                  <button
                    className="quantity-controls-button shadow-lg"
                    onClick={handleDecrease}
                  >
                    <FaMinus />
                  </button>
                  <span className="quantity-controls-count">{quantity}</span>
                  <button
                    className="quantity-controls-button"
                    onClick={handleIncrease}
                  >
                    <FaPlus />
                  </button>
                </div>
              )}
            </div>
          )}
        {isHome && (
          <>
            <p className="card-price">Amount: ${item.sell_price} /KG</p>
            {!itemExists ? (
              <button
                className="add-button flex justify-center items-center"
                onClick={handleAddHomeClick}
              >
                <span className="flex justify-center items-center gap-1 text-xs p-1 shadow-lg">
                  <FaShoppingBasket /> BUY NOW
                </span>
              </button>
            ) : (
              <button
                className="add-button flex justify-center items-center"
                onClick={handleAddHomeClick}
              >
                <span className="flex justify-center items-center gap-1 text-xs p-1 shadow-lg">
                  <FaShoppingBasket /> UPDATE
                </span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Card;
