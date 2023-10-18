import {
  createTRPCProxyClient,
  createTRPCReact,
  httpBatchLink,
} from "@trpc/react-query";
import type { AppRouter } from "../../../server/index";

export const t = createTRPCReact<AppRouter>();

export const tpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_SERVER_URL,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});
