import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export function createContext({ req, res }: CreateExpressContextOptions) {
  return {
    req,
    res,
  };
}

export const t = initTRPC
  .context<inferAsyncReturnType<typeof createContext>>()
  .create();
