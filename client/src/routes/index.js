import UpdateUser from "../pages/UpdateUser";
import Role from "../components/Role";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Logout from "../pages/Logout";
import ForgotPassword from "../pages/ForgotPassword";
export const routes = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },

  // { path: "/forgot-password", element: <ForgotPassword /> },

  { path: "/register", element: <Register /> },
  { path: "/logout", element: <Logout /> },
  { path: "/updateUser", element: <UpdateUser /> },
  { path: "/role", element: <Role /> },
];
