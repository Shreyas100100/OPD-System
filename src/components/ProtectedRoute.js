import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser;

const ProtectedRoute = ({ children }) => {
  const { user } = useUserAuth();

  console.log("Check user in Private: ", user);
  if (!user) {
    return <Navigate to="/" />;
  }
  console.log(user.role);
  if (user.role==="Admin")
  {
    return <Navigate to="/AdminHome" />
  }
  if (user.role==="Patient")
  {
    return <Navigate to="/PatientHome" />
  }
  if (user.role==="Doctor")
  {
    return <Navigate to="/DoctorHome" />
  }
  
  return children;
};

export default ProtectedRoute;