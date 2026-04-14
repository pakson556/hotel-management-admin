import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../contexts/UserAuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, userData } = useUserAuth();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // userData is null while still loading from Firebase
  if (userData === null) {
    return null;
  }

  if (!userData?.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
