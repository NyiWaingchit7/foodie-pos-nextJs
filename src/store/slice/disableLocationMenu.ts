import { DisabledLocationMenuSlice } from "@/types/disbaleLocationMenu";
import { DisabledLocationMenu } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: DisabledLocationMenuSlice = {
  items: [],
  isLoading: false,
  error: null,
};

const DisabledLocationMenuSlice = createSlice({
  name: "DisabledLocationMenuSlice",
  initialState,
  reducers: {
    setDisabledLocationMenus: (
      state,
      action: PayloadAction<DisabledLocationMenu[]>
    ) => {
      state.items = action.payload;
    },

    deleteDisabledLocationMenu: (
      state,
      action: PayloadAction<{ locationId: number; menuId: number }>
    ) => {
      const { locationId, menuId } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.locationId === locationId && item.menuId === menuId)
      );
    },
  },
});

export const { setDisabledLocationMenus, deleteDisabledLocationMenu } =
  DisabledLocationMenuSlice.actions;
export default DisabledLocationMenuSlice.reducer;
