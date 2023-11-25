import ItemCard from "@/pages/component/ItemCard";
import NewMenuCategory from "@/pages/component/NewMenuCategory";
import { useAppSelector } from "@/store/hooks";
import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import CategoryIcon from "@mui/icons-material/Category";

const MenuCategory = () => {
  const [open, setOpen] = useState(false);
  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  const disabledLocationMenuCategories = useAppSelector(
    (state) => state.disableLocationMenuCategory.items
  );
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New menu category
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" ,   justifyContent: { xs: "center", sm: "flex-start" },}}>
        {menuCategories.map((item) => {
          const exist = disabledLocationMenuCategories.find(
            (disabledLocationMenuCategory) =>
              disabledLocationMenuCategory.locationId ===
                Number(localStorage.getItem("selectedLocationId")) &&
              disabledLocationMenuCategory.menuCategoryId === item.id
          );
          const isAvailable = exist ? false : true;
          return (
            <ItemCard
              key={item.id}
              title={item.name}
              icon={<CategoryIcon />}
              href={`/backoffice/menu-categories/${item.id}`}
              isAvailable={isAvailable}
            />
          );
        })}
      </Box>
      <NewMenuCategory open={open} setOpen={setOpen} />
    </Box>
  );
};

export default MenuCategory;
