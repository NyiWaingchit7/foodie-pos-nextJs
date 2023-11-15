import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createAddonCategroy } from "@/store/slice/addonCategorySlice";
import { setOpenSnackbar } from "@/store/slice/snackbarSlice";
import { CreateAddonCategoryOptions } from "@/types/addonCategory";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
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
const defaultNewAddonCategory = {
  name: "",
  isRequired: true,
  menuIds: [],
};

const NewAddonsCategory = ({ open, setOpen }: Props) => {
  const dispatch = useAppDispatch();

  const [newAddonCategory, setNewAddonCategory] =
    useState<CreateAddonCategoryOptions>(defaultNewAddonCategory);
  const menu = useAppSelector((store) => store.menu.items);
  const [selectedMenuIds, setMenuIds] = useState<number[]>([]);
  const handleMCIdChange = (e: SelectChangeEvent<number[]>) => {
    const selectIdChange = e.target.value as number[];
    setMenuIds(selectIdChange);
  };
  const handleCreateMenu = () => {
    dispatch(
      createAddonCategroy({
        ...newAddonCategory,
        menuIds: selectedMenuIds,
        onSuccess,
      })
    );
  };
  const clear = () => {
    setOpen(false);
    setNewAddonCategory(defaultNewAddonCategory);
    setMenuIds([]);
  };
  const onSuccess = () => {
    dispatch(
      setOpenSnackbar({ message: "Created Addon Category Successfully." })
    );
    clear();
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        clear();
      }}
    >
      <DialogTitle>Create new addon category</DialogTitle>
      <DialogContent sx={{ mt: 3, minHeight: 300 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            placeholder="Name ..."
            sx={{ mb: 2 }}
            onChange={(e) => {
              setNewAddonCategory({
                ...newAddonCategory,
                name: e.target.value,
              });
            }}
          />

          <FormControl>
            <InputLabel id="demo-multiple-checkbox-label">Menus</InputLabel>
            <Select
              sx={{ maxWidth: 250 }}
              multiple
              value={selectedMenuIds}
              labelId="demo-multiple-checkbox-label"
              onChange={handleMCIdChange}
              input={<OutlinedInput label="Menus" />}
              renderValue={(selectedMCIds) => {
                return selectedMCIds
                  .map((i) => {
                    return menu.find((m) => m.id === i)?.name;
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
              {menu.map((item) => (
                <MenuItem value={item.id} key={item.id}>
                  <Checkbox checked={selectedMenuIds.includes(item.id)} />
                  <ListItemText primary={item.name} />
                </MenuItem>
              ))}
            </Select>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={newAddonCategory.isRequired}
                  onChange={(evt, value) =>
                    setNewAddonCategory({
                      ...newAddonCategory,
                      isRequired: value,
                    })
                  }
                />
              }
              label="Required"
              sx={{ mt: 1 }}
            />
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
                disabled={!newAddonCategory.name || !selectedMenuIds.length}
                sx={{ width: "fit-content" }}
                onClick={handleCreateMenu}
              >
                Comfirm
              </Button>
            </Box>
          </FormControl>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewAddonsCategory;
