import {
  CreateMenuCategoryOptions,
  DeleteMenuCategoryOptions,
  MenuCategorySliceType,
  UpdateMenuCategoryOptions,
} from "@/types/menuCategory";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { removeMenuCategoryMenu } from "./menuCategoryMenuSlice";
import {
  removeDisalbedLocationmenuCategory,
  setDisabledLocationMenuCategories,
} from "./disableLocationMenuCategorySlice";

const initialState: MenuCategorySliceType = {
  items: [],
  isLoading: false,
  error: null,
};
export const creatMenuCategory = createAsyncThunk(
  "createMenuCategory",
  async (option: CreateMenuCategoryOptions, thunkApi) => {
    const { name, locationId, onSuccess, onError } = option;

    try {
      const response = await fetch(`${config.apiBaseUrl}/menu-category`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, locationId }),
      });

      const data = await response.json();
      thunkApi.dispatch(addMenuCategory(data));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

export const updateMenuCategory = createAsyncThunk(
  "menuCategory/updateMenuCategory",
  async (options: UpdateMenuCategoryOptions, thunkApi) => {
    const { id, name, locationId, isAvaialble, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menu-category`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, locationId, isAvaialble }),
      });
      const { menuCategory, disabledLocationMenuCategory } =
        await response.json();
      thunkApi.dispatch(replaceMenuCategory(menuCategory));
      if (isAvaialble === false) {
        thunkApi.dispatch(
          setDisabledLocationMenuCategories(disabledLocationMenuCategory)
        );
      } else {
        thunkApi.dispatch(
          removeDisalbedLocationmenuCategory({ locationId, menuCategoryId: id })
        );
      }

      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);
export const deleteMenuCategory = createAsyncThunk(
  "deleteMenuCategory",
  async (options: DeleteMenuCategoryOptions, thunkApi) => {
    const { id, onSuccess, onError } = options;
    console.log(id);

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/menu-category?id=${id}`,
        {
          method: "DELETE",
        }
      );

      thunkApi.dispatch(removeMenuCategory({ id }));
      thunkApi.dispatch(removeMenuCategoryMenu({ menuCategoryId: id }));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

const menuCategorySlice = createSlice({
  name: "menuCategorySlice",
  initialState,
  reducers: {
    setMenuCategory: (store, action) => {
      store.items = action.payload;
    },
    addMenuCategory: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    replaceMenuCategory: (state, action) => {
      state.items = state.items.map((i) =>
        i.id === action.payload.id ? action.payload : i
      );
    },
    removeMenuCategory: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload.id);
    },
  },
});
export const {
  setMenuCategory,
  addMenuCategory,
  replaceMenuCategory,
  removeMenuCategory,
} = menuCategorySlice.actions;
export default menuCategorySlice.reducer;
