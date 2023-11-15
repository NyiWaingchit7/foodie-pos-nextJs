import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createMenu } from "@/store/slice/menuSlice";
import { setOpenSnackbar } from "@/store/slice/snackbarSlice";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
  Button,
  Chip,
} from "@mui/material";

import { Dispatch, SetStateAction, useState } from "react";
import FileDropZone from "./FileDropZone";
import { config } from "@/utils/config";
import { CreateMenuOptions } from "@/types/menu";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const defaultMenu = { name: "", price: 0 };

const NewMenu = ({ open, setOpen }: Props) => {
  const dispatch = useAppDispatch();
  const menuCategories = useAppSelector((store) => store.menuCategory.items);
  const [newMenu, setNewMenu] = useState(defaultMenu);
  const [selectedMCIds, setMCIds] = useState<number[]>([]);
  const [menuImage, setMenuImage] = useState<File>();
  const handleMCIdChange = (e: SelectChangeEvent<number[]>) => {
    const selectIdChange = e.target.value as number[];
    setMCIds(selectIdChange);
  };
  const handleCreateMenu = async () => {
    const newMenuPayload: CreateMenuOptions = {
      ...newMenu,
      menuCategoryId: selectedMCIds,
      assetUrl: "",
    };
    if (menuImage) {
      const formData = new FormData();
      formData.append("files", menuImage);
      const response = await fetch(`${config.apiBaseUrl}/asset`, {
        method: "POST",
        body: formData,
      });
      const { assetUrl } = await response.json();
      newMenuPayload.assetUrl = assetUrl;
    }

    dispatch(createMenu({ ...newMenuPayload, onSuccess }));
  };
  const onFileSelected = (files: File[]) => {
    setMenuImage(files[0]);
  };
  const clear = () => {
    setOpen(false);
    setNewMenu(defaultMenu);
    setMCIds([]);
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
      <DialogContent sx={{ mt: 3, minHeight: 300, maxWidth: 300 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            placeholder="Name ..."
            sx={{ mb: 2 }}
            onChange={(e) => {
              setNewMenu({ ...newMenu, name: e.target.value });
            }}
          />
          <TextField
            placeholder="Price ..."
            sx={{ mb: 2 }}
            onChange={(e) => {
              setNewMenu({ ...newMenu, price: Number(e.target.value) });
            }}
          />
          <FormControl>
            <InputLabel id="demo-multiple-checkbox-label">
              Menu Categories
            </InputLabel>
            <Select
              sx={{ maxWidth: 330 }}
              multiple
              value={selectedMCIds}
              labelId="demo-multiple-checkbox-label"
              onChange={handleMCIdChange}
              input={<OutlinedInput label="Menu Categories" />}
              renderValue={(selectedMCIds) => {
                return selectedMCIds
                  .map((i) => {
                    return menuCategories.find((m) => m.id === i)?.name;
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
                <MenuItem value={item.id} key={item.id}>
                  <Checkbox checked={selectedMCIds.includes(item.id)} />
                  <ListItemText primary={item.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ mt: 2 }}>
            <FileDropZone onFileSelected={onFileSelected} />
            {menuImage && (
              <Chip
                sx={{ mt: 2 }}
                label={menuImage.name}
                onDelete={() => setMenuImage(undefined)}
              />
            )}
          </Box>
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
              disabled={!newMenu.name || !selectedMCIds.length}
              sx={{ width: "fit-content" }}
              onClick={handleCreateMenu}
            >
              Comfirm
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewMenu;
