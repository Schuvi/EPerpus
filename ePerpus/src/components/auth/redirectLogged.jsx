import { Navigate, Outlet } from 'react-router-dom';

function RedirectLoggedIn() {
  const isLoggedIn = window.localStorage.getItem("isLoggedIn");
  return isLoggedIn === "true" ? <Navigate to="/" /> : <Outlet />;
}

export default RedirectLoggedIn;