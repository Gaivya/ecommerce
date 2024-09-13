import { createSlice } from "@reduxjs/toolkit";
const storeNameSlice = createSlice({
  name: "storeName",
  initialState: {
    name: "",
    address: "",
  },
  reducers: {
    setStoreName: (state, action) => {
      state.name = action.payload.name;
      state.address = action.payload.address;
    },
  },
});

export const { setStoreName } = storeNameSlice.actions;

export default storeNameSlice.reducer;
