import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import CssBaseline from "@material-ui/core/CssBaseline";

ReactDOM.render(
  // <React.StrictMode>
  <AuthProvider>
    <CssBaseline />
    <App />
  </AuthProvider>,
  // </React.StrictMode>
  document.getElementById("root")
);
