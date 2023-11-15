import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteAddonCategory,
  updateAddonCategory,
} from "@/store/slice/addonCategorySlice";
import { UpdateAddonCategoryOptions } from "@/types/addonCategory";
import {
  Box,
  Button,
  Checkbox,
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
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import menuAddonCategory from "../../../../store/slice/menuAddonCategory";
import { setOpenSnackbar } from "@/store/slice/snackbarSlice";

const AddonCategoryDetail = () => {
  const router = useRouter();
  const addonCategoryId = Number(router.query.id);
  const addonCategories = useAppSelector((state) => state.addonCategory.items);
  const menus = useAppSelector((state) => state.menu.items);
  const menuAddonCategory = useAppSelector(
    (state) => state.menuAddonCategory.items
  );
  const currentAddonCategory = addonCategories.find(
    (item) => item.id === addonCategoryId
  );
  const currentMenuAddonCategories = menuAddonCategory.filter(
    (item) => item.addonCategoryId === addonCategoryId
  );
  const menuIds = currentMenuAddonCategories.map((item) => item.menuId);
  const [data, setData] = useState<UpdateAddonCategoryOptions>();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (currentAddonCategory) {
      setData({
        id: currentAddonCategory.id,
        name: currentAddonCategory.name,
        isRequired: currentAddonCategory.isRequired,
        menuIds,
      });
    }
  }, [currentAddonCategory]);

  if (!currentAddonCategory || !data) return null;

  const handleOnChange = (evt: SelectChangeEvent<number[]>) => {
    const selectedIds = evt.target.value as number[];
    setData({ ...data, id: currentAddonCategory.id, menuIds: selectedIds });
  };

  const handleUpdateMenu = () => {
    dispatch(
      updateAddonCategory({
        ...data,
        onSuccess: () => {
          router.push("/backoffice/addon-categories");
          dispatch(
            setOpenSnackbar({
              message: "Updated Addon Category Successfully.",
            })
          );
        },
      })
    );
    console.log("success");
  };

  const handleDeleteMenu = () => {
    console.log("success");

    dispatch(
      deleteAddonCategory({
        id: addonCategoryId,
        onSuccess: () => {
          router.push("/backoffice/addon-categories");
          dispatch(
            setOpenSnackbar({
              message: "Deleted Addon Category Successfully.",
              severity: "error",
            })
          );
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
        defaultValue={currentAddonCategory.name}
        sx={{ mb: 2 }}
        onChange={(evt) => setData({ ...data, name: evt.target.value })}
      />

      <FormControl fullWidth>
        <InputLabel>Menu </InputLabel>
        <Select
          multiple
          value={data.menuIds}
          label="Menu"
          onChange={handleOnChange}
          renderValue={(selectMenuIds) => {
            return selectMenuIds
              .map(
                (selectMenuId) =>
                  menus.find((item) => item.id === selectMenuId)?.name
              )
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
          {menus.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              <Checkbox checked={data.menuIds.includes(item.id)} />
              <ListItemText primary={item.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControlLabel
        control={
          <Checkbox
            defaultChecked={data.isRequired}
            onChange={(evt, value) =>
              setData({
                ...data,
                isRequired: value,
              })
            }
          />
        }
        label="Required"
        sx={{ mt: 1 }}
      />
      <Button
        variant="contained"
        sx={{ mt: 2, width: "fit-content" }}
        onClick={handleUpdateMenu}
        disabled={!data.name || !data.menuIds.length}
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

export default AddonCategoryDetail;
