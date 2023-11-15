import { MenuAddonCategorySlice } from "@/types/menuAddonCategory";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: MenuAddonCategorySlice = {
  items: [],
  isLoading: false,
  error: null,
};

const menuAddonCategory = createSlice({
  name: "menuAddonCategory",
  initialState,
  reducers: {
    setMenuAddonCategory: (state, action) => {
      state.items = action.payload;
    },
    addMenuAddonCategory: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    replaceMenuAddonCategory: (state, action) => {
      const addonCategoryId = action.payload[0].addonCategoryId;
      const otherMenuCategoryMenu = state.items.filter(
        (item) => item.addonCategoryId !== addonCategoryId
      );
      state.items = [...otherMenuCategoryMenu, ...action.payload];
    },
    removeMenuAddonCategoryByMenuId: (
      state,
      action: PayloadAction<{ menuId: number }>
    ) => {
      state.items = state.items.filter(
        (item) => item.menuId !== action.payload.menuId
      );
    },
    removeMenuAddonCategoryById: (
      state,
      action: PayloadAction<{ id: number }>
    ) => {
      state.items = state.items.filter(
        (item) => item.menuId !== action.payload.id
      );
    },
  },
});
export const {
  setMenuAddonCategory,
  addMenuAddonCategory,
  replaceMenuAddonCategory,
  removeMenuAddonCategoryByMenuId,
  removeMenuAddonCategoryById,
} = menuAddonCategory.actions;
export default menuAddonCategory.reducer;
