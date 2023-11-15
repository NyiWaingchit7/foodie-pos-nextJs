import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../store/slice/appSlice";
import locationReducer from "../store/slice/locationSlice";
import menuCategoryReducer from "../store/slice/menuCategorySlice";
import menuReducer from "../store/slice/menuSlice";
import addonCategoryReducer from "../store/slice/addonCategorySlice";
import addonReducer from "../store/slice/addonSlice";
import tableReducer from "../store/slice/tableSlice";
import menuCategoryMenuReducer from "../store/slice/menuCategoryMenuSlice";
import menuAddonCategoryReducer from "../store/slice/menuAddonCategory";
import snackBarReducer from "../store/slice/snackbarSlice";
import disableLocationMenuCategoryReducer from "../store/slice/disableLocationMenuCategorySlice";
import disableLocationMenuReducer from "../store/slice/disableLocationMenu";
import cartReducer from "../store/slice/cartSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    location: locationReducer,
    menuCategory: menuCategoryReducer,
    menuCategoryMenu: menuCategoryMenuReducer,
    menu: menuReducer,
    menuAddonCategory: menuAddonCategoryReducer,
    addonCategory: addonCategoryReducer,
    addon: addonReducer,
    table: tableReducer,
    snackBar: snackBarReducer,
    disableLocationMenuCategory: disableLocationMenuCategoryReducer,
    disableLocationMenu: disableLocationMenuReducer,
    cart: cartReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
