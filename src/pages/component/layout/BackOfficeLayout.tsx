import { Box } from "@mui/material";
import { ReactNode, useEffect } from "react";
import Topbar from "./Topbar";
import SideBar from "./Sidebar";
import { useSession } from "next-auth/react";

import { fetchAppData } from "@/store/slice/appSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface prop {
  children: ReactNode;
}

const BackOfficeLayout = ({ children }: prop) => {
  const { data } = useSession();
  const dispatch = useAppDispatch();
  const { init } = useAppSelector((state) => state.app);
  useEffect(() => {
    if (data && !init) {
      dispatch(fetchAppData({}));
    }
  }, [data]);

  return (
    <Box>
      <Topbar />
      <Box sx={{ display: "flex", position: "relative", zIndex: 5, flex: 1 }}>
        {data && <SideBar />}
        <Box sx={{ p: 3, width: "100%", height: "100%" }}>{children}</Box>
      </Box>
    </Box>
  );
};
export default BackOfficeLayout;
