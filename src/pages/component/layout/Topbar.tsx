import { Box, Button, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

const Topbar = () => {
  const { data } = useSession();
  return (
    <Box
      sx={{
        bgcolor: "success.main",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
      }}
    >
      <Box sx={{ height: 70 }}>
        <Image src={"/logo.png"} alt="logo" width={150} height={70} />
      </Box>
      <Typography variant="h5" color={"secondary"}>
        Foodie POS
      </Typography>
      {data ? (
        <Box>
          <Button
            variant="contained"
            onClick={() => signOut({ callbackUrl: "/backoffice" })}
          >
            Sign out
          </Button>
        </Box>
      ) : (
        <span />
      )}
    </Box>
  );
};

export default Topbar;
