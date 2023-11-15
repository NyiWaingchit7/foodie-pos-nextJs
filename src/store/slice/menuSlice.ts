import {
  MenuSliceType,
  GetMenuOptions,
  CreateMenuOptions,
  UpdateMenuOptions,
  DeleteMenuOptions,
} from "@/types/menu";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addMenuCategoryMenu,
  replaceMenuCategoryMenu,
} from "./menuCategoryMenuSlice";
import { removeMenuAddonCategoryByMenuId } from "./menuAddonCategory";
import {
  deleteDisabledLocationMenu,
  setDisabledLocationMenus,
} from "./disableLocationMenu";

const initialState: MenuSliceType = {
  items: [],
  isLoading: false,
  error: null,
};

export const getMenus = createAsyncThunk(
  "getMenus",
  async (option: GetMenuOptions, thunkApi) => {
    const { locationId, onSuccess, onError } = option;
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/menu?locationId=${locationId}`
      );
      const data = await response.json();
      const { newMenu } = data;
      console.log(newMenu);

      thunkApi.dispatch(setMenus(data));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

export const createMenu = createAsyncThunk(
  "createMenu",
  async (options: CreateMenuOptions, thunkApi) => {
    const { name, price, menuCategoryId, assetUrl, onSuccess, onError } =
      options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menu`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, price, menuCategoryId, assetUrl }),
      });
      const data = await response.json();
      console.log(data);

      thunkApi.dispatch(addMenu(data.newMenu));
      thunkApi.dispatch(addMenuCategoryMenu(data.newMenuCategoryMenus));

      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

export const updateMenu = createAsyncThunk(
  "updateMenu",
  async (options: UpdateMenuOptions, thunkApi) => {
    console.log(options);

    const {
      id,
      name,
      price,
      menuCategoryIds,
      isAvailable,
      locationId,
      onSuccess,
      onError,
    } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menu`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id,
          name,
          price,
          menuCategoryIds,
          isAvailable,
          locationId,
        }),
      });
      const { menu, menuCategoryMenus, disabledLocationMenus } =
        await response.json();
      thunkApi.dispatch(replaceMenu(menu));
      thunkApi.dispatch(replaceMenuCategoryMenu(menuCategoryMenus));
      if (isAvailable === false) {
        thunkApi.dispatch(setDisabledLocationMenus(disabledLocationMenus));
      } else {
        thunkApi.dispatch(
          deleteDisabledLocationMenu({ locationId, menuId: id })
        );
      }
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);
export const deleteMenu = createAsyncThunk(
  "deleteMenu",
  async (options: DeleteMenuOptions, thunkApi) => {
    const { id, onSuccess, onError } = options;
    console.log(id);

    try {
      console.log("success try");

      const response = await fetch(`${config.apiBaseUrl}/menu?id=${id}`, {
        method: "DELETE",
      });

      thunkApi.dispatch(removeMenu({ id }));
      thunkApi.dispatch(removeMenuAddonCategoryByMenuId({ menuId: id }));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);
const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenus: (state, action) => {
      state.items = action.payload;
    },
    addMenu: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    replaceMenu: (state, action) => {
      state.items = state.items.map((i) =>
        i.id === action.payload.id ? action.payload : i
      );
    },
    removeMenu: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload.id);
    },
  },
});
export const { setMenus, addMenu, replaceMenu, removeMenu } = menuSlice.actions;
export default menuSlice.reducer;
