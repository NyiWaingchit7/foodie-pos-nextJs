import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateCompany } from "@/store/slice/companySlice";
import { UpdateCompanyOptions } from "@/types/company";
import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const SettingsPage = () => {
  const comapny = useAppSelector((state) => state.company.item);
  const [data, setData] = useState<UpdateCompanyOptions>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (comapny) {
      setData({
        id: comapny.id,
        name: comapny.name,
        street: comapny.street,
        township: comapny.township,
        city: comapny.city,
      });
    }
  }, [comapny]);

  if (!comapny || !data) return null;

  const handleUpdateCompany = () => {
    dispatch(updateCompany(data));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <TextField
        defaultValue={data.name}
        sx={{ mb: 2 }}
        onChange={(evt) =>
          setData({ ...data, id: comapny.id, name: evt.target.value })
        }
      />
      <TextField
        defaultValue={data.street}
        sx={{ mb: 2 }}
        onChange={(evt) =>
          setData({ ...data, id: comapny.id, street: evt.target.value })
        }
      />
      <TextField
        defaultValue={data.township}
        sx={{ mb: 2 }}
        onChange={(evt) =>
          setData({ ...data, id: comapny.id, township: evt.target.value })
        }
      />
      <TextField
        defaultValue={data.city}
        sx={{ mb: 2 }}
        onChange={(evt) =>
          setData({ ...data, id: comapny.id, city: evt.target.value })
        }
      />
      <Button
        variant="contained"
        sx={{ mt: 2, width: "fit-content" }}
        onClick={handleUpdateCompany}
      >
        Update
      </Button>
    </Box>
  );
};

export default SettingsPage;
