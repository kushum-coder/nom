import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    API.get("/users/check")
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) return <p>Loading...</p>;

  return isAuth ? children : <Navigate to="/" />;
};

export default ProtectedRoute;