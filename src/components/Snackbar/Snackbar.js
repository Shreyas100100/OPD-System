import React from "react";
import "./Snackbar.css";
const Snackbar = ({ message, isVisible, type }) => {
  const snackbarClass = `snackbar ${type} ${isVisible ? "visible" : ""}`;

  return <div className={snackbarClass}>{message}</div>;
};

export default Snackbar;
