import { Outlet, createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "./layouts/AuthLayout";
import { RootLayout } from "./layouts/RootLayout";
import { NavbarLayout } from "./layouts/NavbarLayout";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Home } from "./pages/Home";

export const router = createBrowserRouter([
  {
    element: <Outlet />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "signup", element: <Signup /> },
        ],
      },
      {
        element: <RootLayout />,
        children: [
          {
            element: <NavbarLayout />,
            children: [{ path: "", element: <Home /> }],
          },
        ],
      },
    ],
  },
]);
