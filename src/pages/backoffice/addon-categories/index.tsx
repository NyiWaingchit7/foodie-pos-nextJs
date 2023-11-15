// src/pages/backoffice/addon-categories/index.tsx

import ItemCard from "@/pages/component/ItemCard";
import NewAddonsCategory from "@/pages/component/NewAddonsCategory";
import { useAppSelector } from "@/store/hooks";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import ClassIcon from "@mui/icons-material/Class";

const AddonCategoriesPage = () => {
  const [open, setOpen] = useState(false);
  const addonCategories = useAppSelector((state) => state.addonCategory.items);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New addon category
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {addonCategories.map((item) => (
          <ItemCard
            key={item.id}
            title={item.name}
            icon={<ClassIcon />}
            href={`/backoffice/addon-categories/${item.id}`}
          />
        ))}
      </Box>
      <NewAddonsCategory open={open} setOpen={setOpen} />
    </Box>
  );
};

export default AddonCategoriesPage;
