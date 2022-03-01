import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Item = {
  id: string;
  item: any;
};

type wishlistState = Item[];

const initialState: wishlistState = [];

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      state.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<Item>) => {
      return state.filter((x) => {
        return x.id !== action.payload.id;
      });
    },
  },
});

// export reducers of the reservationsslice Object, which is basically functions
export default wishlistSlice.reducer;
// export actions
export const { addItem, removeItem } = wishlistSlice.actions;
