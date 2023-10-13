import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  let auth = localStorage.getItem("token");
  if (auth && auth !== "undefined" && auth !== null) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoutes;
