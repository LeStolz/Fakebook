import React from "react";
import ReactDOM from "react-dom/client";
import { TRPCProvider } from "./contexts/TRPCContext";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TRPCProvider>
      <ThemeProvider storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <ReactQueryDevtools />
        <Toaster />
      </ThemeProvider>
    </TRPCProvider>
  </React.StrictMode>
);
