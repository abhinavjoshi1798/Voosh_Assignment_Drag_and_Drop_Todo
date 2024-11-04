import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { isAuth } = useContext(AuthContext);
  const location = useLocation();
  return isAuth ? (
    children
  ) : (
    <Navigate to={"/login"} state={location.pathname} replace />
  );
}

export default PrivateRoute;