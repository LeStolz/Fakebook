import { Loading } from "@/components/ui/Loading";
import { t } from "@/lib/trpc";
import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export function RootLayout() {
  const [status, setStatus] = useState("LOADING");

  t.users.getCurrent.useQuery(undefined, {
    retry: 0,
    onSuccess: () => {
      setStatus("AUTHORIZED");
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        setStatus("UNAUTHORIZED");
      }
    },
  });

  if (status === "LOADING") {
    return <Loading className="w-32 h-32" screen />;
  } else if (status === "UNAUTHORIZED") {
    return <Navigate to="/login" />;
  } else {
    return <Outlet />;
  }
}
