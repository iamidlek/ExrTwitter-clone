import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { firebaseInstance } from "fbase";
ReactDOM.render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>
  document.getElementById("root")
);
