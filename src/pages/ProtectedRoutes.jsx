import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {

  const { user } = useContext(UserContext);

  return user && user.token && user.userType === 'seller' ? <Outlet /> : <Navigate to='/' />
}

export default ProtectedRoutes


