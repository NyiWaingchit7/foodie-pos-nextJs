import ItemCard from "@/pages/component/ItemCard";
import NewLocation from "@/pages/component/NewLocations";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedLocation } from "@/store/slice/locationSlice";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const LocationsPage = () => {
  const [open, setOpen] = useState(false);
  const { items: locations, selectedLocation } = useAppSelector(
    (state) => state.location
  );
  const dispatch = useAppDispatch();
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New location
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {locations.map((item) => (
          <ItemCard
            key={item.id}
            icon={<LocationOnIcon />}
            title={item.name}
            selected={item.id === selectedLocation?.id}
            onClick={() => dispatch(setSelectedLocation(item))}
          />
        ))}
      </Box>
      <NewLocation open={open} setOpen={setOpen} />
    </Box>
  );
};

export default LocationsPage;
