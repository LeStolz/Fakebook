import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export function RootLayout() {
  const { user } = useAuth();

  if (user == null) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
