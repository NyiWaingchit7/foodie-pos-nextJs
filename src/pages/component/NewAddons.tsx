import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createAddon, deleteAddon } from "@/store/slice/addonSlice";
import { setOpenSnackbar } from "@/store/slice/snackbarSlice";
import { CreateAddonOptions } from "@/types/addon";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const defaultAddon = { name: "", price: 0, addonCategoryId: undefined };
const NewAddons = ({ open, setOpen }: Props) => {
  const dispatch = useAppDispatch();
  const addonCategories = useAppSelector((store) => store.addonCategory.items);
  const [newAddon, setNewAddon] = useState<CreateAddonOptions>(defaultAddon);
  const handleOnChange = (e: SelectChangeEvent<number>) => {
    const selectIdChange = e.target.value as number;
    setNewAddon({ ...newAddon, addonCategoryId: selectIdChange });
  };
  const handleCreateAddon = () => {
    dispatch(
      createAddon({
        ...newAddon,
        onSuccess,
      })
    );
  };
  const clear = () => {
    setOpen(false);
    setNewAddon(defaultAddon);
  };
  const onSuccess = () => {
    dispatch(
      setOpenSnackbar({
        message: "Created Menu Successfully.",
      })
    );
    clear();
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogTitle>Create new menu</DialogTitle>
      <DialogContent sx={{ mt: 3, minHeight: 300 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            placeholder="Name ..."
            sx={{ mb: 2 }}
            onChange={(e) => {
              setNewAddon({ ...newAddon, name: e.target.value });
            }}
          />
          <TextField
            placeholder="Price ..."
            sx={{ mb: 2 }}
            onChange={(e) => {
              setNewAddon({ ...newAddon, price: Number(e.target.value) });
            }}
          />
          <FormControl fullWidth>
            <InputLabel>Addon Category</InputLabel>
            <Select
              value={newAddon.addonCategoryId}
              label="Addon Category"
              onChange={handleOnChange}
              renderValue={(selectedAddonCategoryIds) =>
                addonCategories.find((i) => i.id === selectedAddonCategoryIds)
                  ?.name
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
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              sx={{ width: "fit-content", mr: 2 }}
              onClick={clear}
            >
              Cancle
            </Button>
            <Button
              variant="contained"
              disabled={!newAddon.name || !newAddon.addonCategoryId}
              sx={{ width: "fit-content" }}
              onClick={handleCreateAddon}
            >
              Comfirm
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewAddons;
