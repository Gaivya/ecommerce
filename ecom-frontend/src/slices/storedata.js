import { createSlice } from "@reduxjs/toolkit";

const storeDataSlice = createSlice({
  name: "storeData",
  initialState: {},
  reducers: {
    setStoreSliceData: (state, action) => {
      state = action.payload;
    },
  },
});

export const { setStoreSliceData } = storeDataSlice.actions;

export default storeDataSlice.reducer;
