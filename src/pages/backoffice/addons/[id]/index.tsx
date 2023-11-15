import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteAddon, updateAddon } from "@/store/slice/addonSlice";
import { setOpenSnackbar } from "@/store/slice/snackbarSlice";
import { UpdateAddonOptions } from "@/types/addon";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const AddonDetail = () => {
  const router = useRouter();
  const addonId = Number(router.query.id);
  const addons = useAppSelector((state) => state.addon.items);
  const addonCategories = useAppSelector((state) => state.addonCategory.items);

  const currentAddon = addons.find((item) => item.id === addonId);
  const [data, setData] = useState<UpdateAddonOptions>();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (currentAddon) {
      setData({
        id: currentAddon.id,
        name: currentAddon.name,
        price: currentAddon.price,
        addonCategoryId: currentAddon.addonCategoryId,
      });
    }
  }, [currentAddon]);

  if (!currentAddon || !data) return null;

  const handleOnChange = (evt: SelectChangeEvent<number>) => {
    const selectedIds = evt.target.value as number;
    setData({ ...data, id: addonId, addonCategoryId: selectedIds });
  };

  const handleUpdateAddon = () => {
    dispatch(
      updateAddon({
        ...data,
        onSuccess: () => {
          router.push("/backoffice/addons");
          dispatch(
            setOpenSnackbar({
              message: "Updated Addon Successfully.",
            })
          );
        },
      })
    );
    console.log("success");
  };

  const handleDeleteAddon = () => {
    dispatch(
      deleteAddon({
        id: addonId,
        onSuccess: () => {
          router.push("/backoffice/addons");
          dispatch(
            setOpenSnackbar({
              message: "Deleted Addon Successfully.",
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
        defaultValue={currentAddon.name}
        sx={{ mb: 2 }}
        onChange={(evt) =>
          setData({ ...data, id: addonId, name: evt.target.value })
        }
      />
      <TextField
        defaultValue={currentAddon.price}
        sx={{ mb: 2 }}
        onChange={(evt) =>
          setData({ ...data, id: addonId, price: Number(evt.target.value) })
        }
      />
      <FormControl fullWidth>
        <InputLabel>Addon Category</InputLabel>
        <Select
          value={data.addonCategoryId}
          label="Addon Category"
          onChange={handleOnChange}
          renderValue={(selectedAddonCategoryIds) =>
            addonCategories.find((i) => i.id === selectedAddonCategoryIds)?.name
          }
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 48 * 4.5 + 8,
                width: 250,
              },
            },
          }}
        >
          {addonCategories.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              <ListItemText primary={item.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        sx={{ mt: 2, width: "fit-content" }}
        onClick={handleUpdateAddon}
        disabled={!data.name || !data.addonCategoryId}
      >
        Update
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm delete Addon</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this Addon?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDeleteAddon}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddonDetail;
