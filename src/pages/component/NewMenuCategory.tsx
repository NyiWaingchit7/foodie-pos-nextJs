import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { creatMenuCategory } from "@/store/slice/menuCategorySlice";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const NewMenuCategory = ({ open, setOpen }: Props) => {
  const [name, setName] = useState<string>("");
  const dispatch = useAppDispatch();
  const menuCategories = useAppSelector((store) => store.menuCategory.items);
  const unique = menuCategories.find(
    (m) =>
      m.name.toLowerCase().replace(/\s+/g, "") ===
      name.toLocaleLowerCase().replace(/\s+/g, "")
  );
  const handleCreateMenuCategory = () => {
    const locationId = Number(localStorage.getItem("selectedLocationId"));

    dispatch(creatMenuCategory({ name, locationId, onSuccess }));
  };
  const onSuccess = () => {
    setOpen(false);
    setName("");
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setName("");
      }}
    >
      <DialogTitle>Create new menu category</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <TextField
            label="Name"
            variant="outlined"
            autoFocus
            sx={{ width: "100%" }}
            onChange={(evt) => setName(evt.target.value)}
          />
          {unique ? (
            <Typography sx={{ color: "red", mt: 1 }}>
              This name has alreday taken!
            </Typography>
          ) : (
            <span></span>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ mr: 1, mb: 1 }}>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            setName("");
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={!name || unique ? true : false}
          onClick={handleCreateMenuCategory}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewMenuCategory;
