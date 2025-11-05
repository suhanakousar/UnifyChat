import { Navigate, Outlet, useLocation } from "react-router-dom";

export const RequireAuth = () => {
  const token = localStorage.getItem("authToken");
  const location = useLocation();

  return token ? <Outlet /> : <Navigate to={`/Signin?redirect=${encodeURIComponent(location.pathname)}`} replace />;
};
