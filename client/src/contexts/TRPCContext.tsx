import { t, tpc } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { ReactNode, useState } from "react";

type TRPCProviderProps = {
  children: ReactNode;
};

export function TRPCProvider({ children }: TRPCProviderProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    t.createClient({
      links: [
        httpBatchLink({
          url: import.meta.env.VITE_SERVER_URL,
          async fetch(url, options) {
            const res = await fetch(url, {
              ...options,
              credentials: "include",
            });

            if (res.status === 401) {
              try {
                await tpc.users.refreshToken.query();

                return fetch(url, {
                  ...options,
                  credentials: "include",
                });
              } catch {
                return res;
              }
            }

            return res;
          },
        }),
      ],
    })
  );

  return (
    <t.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </t.Provider>
  );
}
