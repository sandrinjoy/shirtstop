import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Filter = "All" | "Men" | "Women";
type Sort = "default" | "high" | "low";
interface itemMethodsState {
  filter: Filter;
  sorting: Sort;
  search: string;
  index: number;
}

const initialState: itemMethodsState = {
  filter: "All",
  sorting: "default",
  search: "",
  index: 0,
};

export const itemMethodsSlice = createSlice({
  name: "itemMethods",
  initialState,
  reducers: {
    changeFilter: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
      return state;
    },
    changeSort: (state, action: PayloadAction<Sort>) => {
      state.sorting = action.payload;
      return state;
    },
    changeSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      return state;
    },
    changeIndex: (state, action: PayloadAction<number>) => {
      state.index = action.payload;
      return state;
    },
  },
});

// export reducers of the reservationsslice Object, which is basically functions
export default itemMethodsSlice.reducer;
// export actions
export const { changeFilter, changeSearch, changeSort, changeIndex } =
  itemMethodsSlice.actions;
