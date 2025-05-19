import React from "react";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { createRoot } from "react-dom/client";
import "./Assets/globals.css";
import { ToastContainer } from "react-toastify";
// import "react-tostify/dist/ReactToastify.css";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <App />
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      //   transition={Bounce}
    />
  </Provider>
);
