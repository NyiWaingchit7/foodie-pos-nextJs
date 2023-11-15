import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeAddonCategory } from "@/store/slice/addonCategorySlice";
import { removeMenuAddonCategoryById } from "@/store/slice/menuAddonCategory";
import { deleteMenu, updateMenu } from "@/store/slice/menuSlice";
import { setOpenSnackbar } from "@/store/slice/snackbarSlice";

import { UpdateMenuOptions } from "@/types/menu";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
} from "@mui/material";
import { MenuCategory } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MenuDetail = () => {
  const router = useRouter();
  const menuId = Number(router.query.id);
  const menus = useAppSelector((state) => state.menu.items);
  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  const menuCategoryMenus = useAppSelector(
    (state) => state.menuCategoryMenu.items
  );
  const menu = menus.find((item) => item.id === menuId);
  const menuCategoryMenu = menuCategoryMenus.filter(
    (item) => item.menuId === menuId
  );
  const menuAddonCategories = useAppSelector(
    (state) => state.menuAddonCategory.items
  );

  const menuCategoryIds = menuCategoryMenu.map((item) => item.menuCategoryId);
  const [data, setData] = useState<UpdateMenuOptions>();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const disabledLocationMenus = useAppSelector(
    (state) => state.disableLocationMenu.items
  );

  useEffect(() => {
    if (menu) {
      const selectedLocationId = Number(
        localStorage.getItem("selectedLocationId")
      );
      const disabledLocationMenu = disabledLocationMenus.find(
        (item) =>
          item.locationId === selectedLocationId && item.menuId === menuId
      );
      setData({
        ...menu,
        menuCategoryIds,
        locationId: selectedLocationId,
        isAvailable: disabledLocationMenu ? false : true,
      });
    }
  }, [menu, disabledLocationMenus]);
  if (!menu || !data) return null;

  const handleOnChange = (evt: SelectChangeEvent<number[]>) => {
    const selectedIds = evt.target.value as number[];
    setData({ ...data, id: menuId, menuCategoryIds: selectedIds });
  };

  const handleUpdateMenu = () => {
    dispatch(
      updateMenu({
        ...data,
        onSuccess: () => {
          router.push("/backoffice/menus");
          dispatch(
            setOpenSnackbar({
              message: "Updated Menu Successfully.",
            })
          );
        },
      })
    );
    console.log("success");
  };

  const handleDeleteMenu = () => {
    dispatch(
      deleteMenu({
        id: menuId,
        onSuccess: () => {
          menuAddonCategories
            .filter((item) => item.menuId === menuId)
            .map((item) => item.addonCategoryId)
            .forEach((addonCategoryId) => {
              const entries = menuAddonCategories.filter(
                (item) => item.addonCategoryId === addonCategoryId
              );
              console.log(entries);
              if (entries.length === 1) {
                const menuAddonCategoryId = entries[0].id;
                console.log(menuAddonCategoryId);

                dispatch(removeAddonCategory({ id: addonCategoryId }));
                dispatch(
                  removeMenuAddonCategoryById({ id: menuAddonCategoryId })
                );
              }
            });
        },
      })
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="outlined" color="error" onClick={() => setOpen(true)}>
          Delete
        </Button>
      </Box>
      <TextField
        defaultValue={menu.name}
        sx={{ mb: 2 }}
        onChange={(evt) =>
          setData({ ...data, id: menuId, name: evt.target.value })
        }
      />
      <TextField
        defaultValue={menu.price}
        sx={{ mb: 2 }}
        onChange={(evt) =>
          setData({ ...data, id: menuId, price: Number(evt.target.value) })
        }
      />
      <FormControl fullWidth>
        <InputLabel>Menu Category</InputLabel>
        <Select
          multiple
          value={data.menuCategoryIds}
          label="Menu Category"
          onChange={handleOnChange}
          renderValue={(selectedMenuCategoryIds) => {
            return selectedMenuCategoryIds
              .map((selectedMenuCategoryId) => {
                return menuCategories.find(
                  (item) => item.id === selectedMenuCategoryId
                )?.name;
              })
              .join(", ");
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 48 * 4.5 + 8,
                width: 250,
              },
            },
          }}
        >
          {menuCategories.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              <Checkbox checked={data.menuCategoryIds.includes(item.id)} />
              <ListItemText primary={item.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControlLabel
        control={
          <Switch
            defaultChecked={data.isAvailable}
            onChange={(evt, value) => setData({ ...data, isAvailable: value })}
          />
        }
        label="Available"
      />
      <Button
        variant="contained"
        sx={{ mt: 2, width: "fit-content" }}
        onClick={handleUpdateMenu}
      >
        Update
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm delete menu</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this menu?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDeleteMenu}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuDetail;
