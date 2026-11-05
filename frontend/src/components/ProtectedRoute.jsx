import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Check whether the user is logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check whether the user has the correct role
  if (role !== allowedRole) {
    if (role === "guide") {
      return <Navigate to="/guide-dashboard" replace />;
    }

    if (role === "member") {
      return <Navigate to="/member-dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
