import { createSlice } from "@reduxjs/toolkit";

const subcategorySlice = createSlice({
  name: "subcategory",
  initialState: {
    selectedSubcategory: null,
  },
  reducers: {
    setSubcategory(state, action) {
      state.selectedSubcategory = action.payload;
    },
  },
});

export const { setSubcategory } = subcategorySlice.actions;
export default subcategorySlice.reducer;
