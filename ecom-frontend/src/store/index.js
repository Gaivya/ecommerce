import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../slices/counterSlice";
import storeReducer from "../slices/storeslice";
import cartReducer from "../slices/cartSlice";
import subcategoryReducer from "../slices/subcategoryslice";
import storeNameReducer from "../slices/storenameslice";
import storeDataReducer from "../slices/storedata";
import orderDataReducer from "../slices/orderDetailsSlice"
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    store: storeReducer,
    cart: cartReducer,
    subcategory: subcategoryReducer,
    storeName: storeNameReducer,
    storeData: storeDataReducer,
    orderDetails:orderDataReducer
  },
});
