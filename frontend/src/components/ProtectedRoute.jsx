import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ element: Component, requiredRoles }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("nivel_acesso");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(userRole)) {
    return <Navigate to="/home" replace />;
  }

  return <Component />;
}
