import React from "react";
import ReactDOM from "react-dom/client";
import { TRPCProvider } from "./contexts/TRPCContext";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TRPCProvider>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </TRPCProvider>
  </React.StrictMode>
);
