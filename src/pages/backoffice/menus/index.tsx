import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import NewMenu from "../../component/NewMenus";
import { useAppSelector } from "@/store/hooks";
import ItemCard from "@/pages/component/ItemCard";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import { config } from "@/utils/config";
import MenuCard from "@/pages/component/MenuCard";

const Menu = () => {
  const [open, setOpen] = useState(false);
  const menus = useAppSelector((state) => state.menu.items);
  const disabledLocationMenus = useAppSelector(
    (state) => state.disableLocationMenu.items
  );
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New menu
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {menus.map((item) => {
          const exist = disabledLocationMenus.find(
            (disabledLocationMenu) =>
              disabledLocationMenu.locationId ===
                Number(localStorage.getItem("selectedLocationId")) &&
              disabledLocationMenu.menuId === item.id
          );
          const isAvailable = exist ? false : true;
          return (
            <MenuCard
              href={`/backoffice/menus/${item.id}`}
              key={item.id}
              menu={item}
              isAvailable={isAvailable}
            />
          );
        })}
      </Box>
      <NewMenu open={open} setOpen={setOpen} />
    </Box>
  );
};

export default Menu;
