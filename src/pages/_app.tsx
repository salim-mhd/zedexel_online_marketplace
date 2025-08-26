import { store } from "@/store/store";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }: AppProps) {
  
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
