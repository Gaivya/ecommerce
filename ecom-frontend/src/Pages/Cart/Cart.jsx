import { useEffect, useState } from "react";
import CartStep from "./CartStep";
import ConfirmOrderStep from "./ConfirmOrderStep";
import PaymentStep from "./PaymentStep";
import { useSelector } from "react-redux";
import emptyCart from "../../assets/emptyCart.jpg";
const Cart = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const [isLoggedIn, setIsLoggedIn] = useState();
  const storeId = useSelector((state) => state.store.selectedStore);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [deliverytype, setDeliverytype] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  let auth = localStorage.getItem("AuthToken");
  let user = localStorage.getItem("User");
  const [currentStep, setCurrentStep] = useState(1);

  const [orderDetail, setOrderDetail] = useState({
    store_id: storeId,
    user_id: user,
    date_time: new Date(),
    payment_mode: "eftpos",
    order_number: "",
    orders: "",
    notes: "NA",
    address: "",
    driver_id: "NA",
    sub_total: 0,
    driver_id:'NA',
    quantities:'0',
    surcharge: "NA",
    delivery_charge: 0,
    coupon_code: '0',
    discount: 0,
    order_type: "online",
    quantities: "",
    change: 0,
    tender_amount: 0,
    split_payment: '1',
    reference_id: "1",
    status: "NA",
    grand_total: 0,
    uid: "0",
  });
  useEffect(() => {
    if (storeId === "1") {
      setOrderDetail({
        ...orderDetail,
        order_number: `S1O${new Date().getTime()}`,
      });
    } else if (storeId === "2") {
      setOrderDetail({
        ...orderDetail,
        order_number: `S2O${new Date().getTime()}`,
      });
    }
  }, [storeId]);
  useEffect(() => {
    if (auth && user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handlePlaceOrder = () => {
    setCurrentStep(2);
  };

  const handleBackToCart = () => {
    setCurrentStep(1);
  };
  const onBackToConfirm = () => {
    setCurrentStep(2);
  };
  const handleProceedToPayment = () => {
    setCurrentStep(3);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-11">
        <img src={emptyCart} height={200} width={200}></img>
        <p>No items found</p>
      </div>
    );
  }

  return (
    <div>
      {currentStep === 1 && (
        <CartStep
          cartItems={cartItems}
          onPlaceOrder={handlePlaceOrder}
          handleProceedToPayment={handleProceedToPayment}
          isPopupVisible={isPopupVisible}
          onTogglePopup={togglePopup}
          isLoggedIn={isLoggedIn}
          orderDetail={orderDetail}
          setIsLoggedIn={setIsLoggedIn}
          deliveryCharges={deliveryCharges}
          setDeliveryCharges={setDeliveryCharges}
          discount={discount}
          setDiscount={setDiscount}
          isCouponApplied={isCouponApplied}
          setIsCouponApplied={setIsCouponApplied}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          setDeliverytype={setDeliverytype}
        />
      )}
      {currentStep === 2 && (
        <ConfirmOrderStep
          cartItems={cartItems}
          onBackToCart={handleBackToCart}
          onProceedToPayment={handleProceedToPayment}
          isLoggedIn={isLoggedIn}
          orderDetail={orderDetail}
          deliveryCharges={deliveryCharges}
          discount={discount}
          setDiscount={setDiscount}
          isCouponApplied={isCouponApplied}
          setIsCouponApplied={setIsCouponApplied}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
        />
      )}
      {currentStep === 3 && (
        <PaymentStep
          isLoggedIn={isLoggedIn}
          onBackToConfirm={onBackToConfirm}
          onBackToCart={handleBackToCart}
          deliveryCharges={deliveryCharges}
          discount={discount}
          orderDetail={orderDetail}
          cartItems={cartItems}
          setOrderDetail={setOrderDetail}
          // cartItemCount={cartItemCount}
          couponCode={couponCode}
          isCouponApplied={isCouponApplied}
          deliverytype={deliverytype}
        />
      )}
    </div>
  );
};

export default Cart;
