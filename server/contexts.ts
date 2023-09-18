import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { t } from "./trpc";
import { TRPCError } from "@trpc/server";

export function createContext({ req, res }: CreateExpressContextOptions) {
  return {
    isAuthenticated: false,
  };
}

const isAuthenticatedMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.isAuthenticated) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  return next({ ctx: { user: {} } });
});

export const isAuthenticatedProcedure = t.procedure.use(
  isAuthenticatedMiddleware
);
