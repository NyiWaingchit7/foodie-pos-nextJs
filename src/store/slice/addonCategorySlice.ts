import {
  AddonCategorySliceType,
  CreateAddonCategoryOptions,
  DeleteAddonCategoryOptions,
  UpdateAddonCategoryOptions,
} from "@/types/addonCategory";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addMenuAddonCategory,
  replaceMenuAddonCategory,
} from "./menuAddonCategory";
const initialState: AddonCategorySliceType = {
  items: [],
  isLoading: false,
  error: null,
};
export const createAddonCategroy = createAsyncThunk(
  "createMenu",
  async (options: CreateAddonCategoryOptions, thunkApi) => {
    const { name, menuIds, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/addon-category`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, menuIds }),
      });
      const data = await response.json();
      console.log(data);

      thunkApi.dispatch(addAddonCategory(data.newAddonCategory));
      thunkApi.dispatch(addMenuAddonCategory(data.newMenuAddonCategory));

      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

export const updateAddonCategory = createAsyncThunk(
  "updateMenu",
  async (options: UpdateAddonCategoryOptions, thunkApi) => {
    console.log(options);

    const { id, name, menuIds, isRequired, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/addon-category`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, menuIds, isRequired }),
      });

      const data = await response.json();
      console.log(data);

      thunkApi.dispatch(replaceAddonCategory(data.addonCategory));
      thunkApi.dispatch(replaceMenuAddonCategory(data.menuAddonCategories));

      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);
export const deleteAddonCategory = createAsyncThunk(
  "deleteMenu",
  async (options: DeleteAddonCategoryOptions, thunkApi) => {
    const { id, onSuccess, onError } = options;

    try {
      console.log("success try");

      const response = await fetch(
        `${config.apiBaseUrl}/addon-category?id=${id}`,
        {
          method: "DELETE",
        }
      );

      thunkApi.dispatch(removeAddonCategory({ id }));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

const addonCategorySlice = createSlice({
  name: "addonCategorySlice",
  initialState,
  reducers: {
    setAddonCategory: (store, action) => {
      store.items = action.payload;
    },
    addAddonCategory: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    replaceAddonCategory: (state, action) => {
      state.items = state.items.map((i) =>
        i.id === action.payload.id ? action.payload : i
      );
    },
    removeAddonCategory: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload.id);
    },
  },
});
export const {
  setAddonCategory,
  addAddonCategory,
  replaceAddonCategory,
  removeAddonCategory,
} = addonCategorySlice.actions;
export default addonCategorySlice.reducer;
