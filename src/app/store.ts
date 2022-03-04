import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import cartReducer from "../features/cart/cartSlice";

import wishlistReducer from "../features/wishlist/wishlistSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      cart: cartReducer,
      wishlist: wishlistReducer,
    },
  });
}
const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
