import { MenuCategoryMenu } from "@prisma/client";
import { AppBaseOptions, AppSlice, GetAppDataOptions } from "@/types/app";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import MenuCategory from "../../pages/backoffice/menu-categories/index";
import { setMenuCategory } from "./menuCategorySlice";
import { setMenus } from "./menuSlice";
import { setTables } from "./tableSlice";
import { setAddonCategory } from "./addonCategorySlice";
import { setAddon } from "./addonSlice";
import { setLocations } from "./locationSlice";
import { setMenuCategoryMenu } from "./menuCategoryMenuSlice";
import { setMenuAddonCategory } from "./menuAddonCategory";
import { setDisabledLocationMenuCategories } from "./disableLocationMenuCategorySlice";
import { setDisabledLocationMenus } from "./disableLocationMenu";
import { setOrders } from "./orderSlice";
import { setCompany } from "./companySlice";

const initialState: AppSlice = {
  init: false,
  isLoading: false,
  error: null,
};

export const fetchAppData = createAsyncThunk(
  "appData",
  async (option: GetAppDataOptions, thunkApi) => {
    const { tableId, onSuccess, onError } = option;
    try {
      const appDataUrl = tableId
        ? `${config.apiBaseUrl}/app?tableId=${tableId}`
        : `${config.apiBaseUrl}/app`;
      const response = await fetch(appDataUrl);
      const data = await response.json();
      const {
        locations,
        menuCategories,
        menus,
        menuCategoryMenus,
        addonCategories,
        menuAddonCategories,
        addons,
        tables,
        disabledLocationMenuCategories,
        disabledLocationMenus,
        orders,
        company,
      } = data;

      thunkApi.dispatch(setInit(true));
      thunkApi.dispatch(setMenuCategory(menuCategories));
      thunkApi.dispatch(setMenus(menus));
      thunkApi.dispatch(setMenuCategoryMenu(menuCategoryMenus));
      thunkApi.dispatch(setMenuAddonCategory(menuAddonCategories));
      thunkApi.dispatch(setTables(tables));
      thunkApi.dispatch(setAddonCategory(addonCategories));
      thunkApi.dispatch(setAddon(addons));
      thunkApi.dispatch(setLocations(locations));
      thunkApi.dispatch(setOrders(orders));
      thunkApi.dispatch(setCompany(company));
      thunkApi.dispatch(
        setDisabledLocationMenuCategories(disabledLocationMenuCategories)
      );
      thunkApi.dispatch(setDisabledLocationMenus(disabledLocationMenus));

      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

const appSlice = createSlice({
  name: "appSLice",
  initialState,
  reducers: {
    setInit: (store, action) => {
      store.init = action.payload;
    },
  },
});
export const { setInit } = appSlice.actions;
export default appSlice.reducer;
