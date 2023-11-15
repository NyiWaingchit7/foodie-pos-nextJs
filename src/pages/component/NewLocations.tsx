// src/components/NewLocation.tsx

import { useAppDispatch } from "@/store/hooks";
import { createNewLocation } from "@/store/slice/locationSlice";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import NewLocations from "@/pages/component/NewLocations";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const NewLocation = ({ open, setOpen }: Props) => {
  const [newLocation, setNewLocation] = useState({ name: "", address: "" });
  const dispatch = useAppDispatch();
  const onSuccess = () => {
    setOpen(false);
  };
  const handleCreateNewLocation = () => {
    dispatch(
      createNewLocation({
        name: newLocation.name,
        address: newLocation.address,
        onSuccess,
      })
    );
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "400px", // Set your width here
          },
        },
      }}
    >
      <DialogTitle>Create new location</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", mt : 3 }}>
          <TextField
            placeholder="Name"
            sx={{ mb: 2 }}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, name: evt.target.value })
            }
          />
          <TextField
            placeholder="Address"
            onChange={(evt) =>
              setNewLocation({ ...newLocation, address: evt.target.value })
            }
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              sx={{ width: "fit-content", mr: 2 }}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={!newLocation.name || !newLocation.address}
              variant="contained"
              sx={{ width: "fit-content" }}
              // onClick={() => {
              //   dispatch(
              //     createNewLocation({
              //       ...newLocation,
              //       onSuccess: () => setOpen(false),
              //     })
              //   );
              // }}
              onClick={handleCreateNewLocation}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewLocation;