import { createSlice } from "@reduxjs/toolkit";

const orderDetailsSlice = createSlice({
  name: "orderDetails",
  initialState: {}, // Initialize with null or an empty object if appropriate
  reducers: {
    setOrderDetails: (state, action) => {
      return action.payload;
    },
  },
});

export const { setOrderDetails } = orderDetailsSlice.actions;
export default orderDetailsSlice.reducer;
