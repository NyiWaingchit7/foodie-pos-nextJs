import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  AddonSliceType,
  CreateAddonOptions,
  DeleteAddonOptions,
  GetAddonOptions,
  UpdateAddonOptions,
} from "@/types/addon";
const initialState: AddonSliceType = {
  items: [],
  isLoading: false,
  error: null,
};

export const getAddon = createAsyncThunk(
  "getaddon",
  async (option: GetAddonOptions, thunkApi) => {
    const { name, onSuccess, onError } = option;
    try {
      const response = await fetch(`${config.apiBaseUrl}/addon`);
      const data = await response.json();
      const { addon } = data;
      console.log(addon);

      thunkApi.dispatch(setAddon(data));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);
export const createAddon = createAsyncThunk(
  "createAddon",
  async (options: CreateAddonOptions, thunkApi) => {
    const { name, price, addonCategoryId, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/addon`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, price, addonCategoryId }),
      });
      const data = await response.json();
      console.log(data);

      thunkApi.dispatch(addAddon(data));

      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

export const updateAddon = createAsyncThunk(
  "updateAddon",
  async (options: UpdateAddonOptions, thunkApi) => {
    console.log(options);

    const { id, name, price, addonCategoryId, onSuccess, onError } = options;
    try {
      console.log("success");

      const response = await fetch(`${config.apiBaseUrl}/addon`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, price, addonCategoryId }),
      });

      const data = await response.json();
      console.log("sucess request");

      thunkApi.dispatch(replaceAddon(data));

      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);
export const deleteAddon = createAsyncThunk(
  "deleteAddon",
  async (options: DeleteAddonOptions, thunkApi) => {
    const { id, onSuccess, onError } = options;

    try {
      const response = await fetch(`${config.apiBaseUrl}/addon?id=${id}`, {
        method: "DELETE",
      });

      thunkApi.dispatch(removeAddon({ id }));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);
const menuSlice = createSlice({
  name: "addon",
  initialState,
  reducers: {
    setAddon: (state, action) => {
      state.items = action.payload;
    },
    addAddon: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    replaceAddon: (state, action) => {
      state.items = state.items.map((i) =>
        i.id === action.payload.id ? action.payload : i
      );
    },
    removeAddon: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload.id);
    },
  },
});
export const { setAddon, addAddon, replaceAddon, removeAddon } =
  menuSlice.actions;
export default menuSlice.reducer;
