import React from "react";
import AuthComponent from "../modules/auth/ui/components/AuthComponent";
import { AppRouter } from "../modules/router";
import { ToastContainer } from "react-toastify";

import "./../css/main.css";
import "./../css/toast.css";

export default function App() {
  return (
    <AuthComponent>
      <ToastContainer />
      <AppRouter />
    </AuthComponent>
  );
}
