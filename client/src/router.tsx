import { Outlet, createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "./layouts/AuthLayout";
import { RootLayout } from "./layouts/RootLayout";
import { NavbarLayout } from "./layouts/NavbarLayout";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Home } from "./pages/Home";
import { AuthProvider } from "./contexts/AuthContext";

export const router = createBrowserRouter([
  {
    element: <ContextProviders />,
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

function ContextProviders() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
