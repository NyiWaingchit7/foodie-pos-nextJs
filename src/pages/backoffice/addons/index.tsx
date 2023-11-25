import ItemCard from "@/pages/component/ItemCard";
import NewAddons from "@/pages/component/NewAddons";
import { useAppSelector } from "@/store/hooks";
import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import EggIcon from "@mui/icons-material/Egg";

const Addon = () => {
  const [open, setOpen] = useState(false);
  const addons = useAppSelector((state) => state.addon.items);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New addon
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap",  justifyContent: { xs: "center", sm: "flex-start" }, }}>
        {addons.map((item) => (
          <ItemCard
            key={item.id}
            title={item.name}
            icon={<EggIcon />}
            href={`/backoffice/addons/${item.id}`}
          />
        ))}
      </Box>
      <NewAddons open={open} setOpen={setOpen} />
    </Box>
  );
};

export default Addon;
