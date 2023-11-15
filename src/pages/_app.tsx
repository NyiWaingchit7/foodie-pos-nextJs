import type { AppProps } from "next/app";
import Layout from "./component/layout/Layout";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@emotion/react";
import { theme } from "@/utils/theme";
import { Provider } from "react-redux";
import { store } from "../store/index";
import Snackbar from "./component/SnackBar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
            <Snackbar />
          </Layout>
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  );
}
