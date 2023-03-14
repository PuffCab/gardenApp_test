import React from "react";
import { useContext } from "react";
import { AuthContext } from "../store/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { loggedinUser } = useContext(AuthContext);
  //   const isUser = user.email ? true : false;

  return <>{loggedinUser ? children : <Navigate to="/login" />}</>;
}

export default ProtectedRoute;
