import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import OrderAppHeader from "./OrderAppHeader";
import { fetchAppData } from "@/store/slice/appSlice";

interface Props {
  children: string | JSX.Element | JSX.Element[];
}

const OrderLayout = (props: Props) => {
  const router = useRouter();
  const { tableId } = router.query;
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const isHome = router.pathname === "/order";
  console.log();

  useEffect(() => {
    if (tableId) {
      dispatch(fetchAppData({ tableId: Number(tableId) }));
    }
  }, [tableId]);

  return (
    <Box>
      <OrderAppHeader cartItemCount={cartItems.length} />
      <Box sx={{ position: "relative", top: isHome ? 240 : 0 }}>
        <Box sx={{ width: { xs: "100%", md: "80%", lg: "55%" }, m: "0 auto" }}>
          {props.children}
        </Box>
      </Box>
    </Box>
  );
};

export default OrderLayout;
