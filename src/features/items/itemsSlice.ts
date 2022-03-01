import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type itemsState = any[];

const initialState: itemsState = [];

export const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    newItems: (state, action: PayloadAction<any[]>) => action.payload,
    appendItems: (state, action: PayloadAction<any[]>) => {
      return [...state, ...action.payload];
    },
  },
});

// export reducers of the reservationsslice Object, which is basically functions
export default itemsSlice.reducer;
// export actions
export const { newItems, appendItems } = itemsSlice.actions;
