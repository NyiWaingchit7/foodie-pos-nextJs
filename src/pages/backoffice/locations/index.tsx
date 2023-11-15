import ItemCard from "@/pages/component/ItemCard";
import NewLocations from "@/pages/component/NewLocations";
import { useAppSelector } from "@/store/hooks";
import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Location = () => {
  const [open, setOpen] = useState(false);
  const locations = useAppSelector((state) => state.location.items);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New location
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {locations.map((item) => (
          <ItemCard key={item.id} title={item.name} icon={<LocationOnIcon />} />
        ))}
      </Box>
      <NewLocations open={open} setOpen={setOpen} />
    </Box>
  );
};

export default Location;
