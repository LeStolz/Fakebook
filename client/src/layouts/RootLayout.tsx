import { t } from "@/lib/trpc";
import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loading } from "@/components/ui/Loading";

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
    return <Loading className="w-24 h-24" screen />;
  } else if (status === "UNAUTHORIZED") {
    return <Navigate to="/login" />;
  } else {
    return <Outlet />;
  }
}
