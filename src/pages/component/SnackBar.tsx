import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetSnackbar } from "@/store/slice/snackbarSlice";

import { Alert, Snackbar as MuiSnackBar } from "@mui/material";

const Snackbar = () => {
  const { open, severity, message, autoHideDuration } = useAppSelector(
    (state) => state.snackBar
  );
  const dispatch = useAppDispatch();
  setTimeout(() => dispatch(resetSnackbar()), autoHideDuration);
  return (
    <MuiSnackBar
      open={open}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </MuiSnackBar>
  );
};

export default Snackbar;
