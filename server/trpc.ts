import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { createContext } from "./contexts";

export const t = initTRPC
  .context<inferAsyncReturnType<typeof createContext>>()
  .create();
