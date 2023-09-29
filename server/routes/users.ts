import { User } from "../models/User";
import { t } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Error } from "mongoose";

const protectedMiddleware = t.middleware(async ({ ctx, next }) => {
  const { email } = ctx.req.signedCookies.authorization || {};
  const user = await User.findOne({ email });

  if (email == null || user == null) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You have to be logged in to perform this action",
    });
  }

  return next({ ctx: { user: user.toObject() } });
});

const privateMiddleware = protectedMiddleware.unstable_pipe(({ ctx, next }) => {
  if (!ctx.user.isAdmin) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not authorized to perform this action",
    });
  }

  return next();
});

export const protectedProcedure = t.procedure.use(protectedMiddleware);
export const privateProcedure = t.procedure.use(privateMiddleware);

export const users = t.router({
  signup: t.procedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input: { email, password } }) => {
      try {
        const user = await User.create({ email, password });

        ctx.res.cookie("authorization", { email }, { signed: true });

        return await user.toObject();
      } catch (error: any) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        } else if (error.name === "MongoServerError") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "A user with this email already exists",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Signup failed. Please try again later",
        });
      }
    }),

  login: t.procedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ ctx, input: { email, password } }) => {
      const user = await User.findOne({ email, password });

      if (email == null || password == null || user == null) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email and password do not match",
        });
      }

      ctx.res.cookie("authorization", { email }, { signed: true });

      return await user.toObject();
    }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    ctx.res.clearCookie("authorization");
    return true;
  }),

  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),
});
