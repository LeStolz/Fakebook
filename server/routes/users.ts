import { User } from "../models/User";
import { t } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Error } from "mongoose";
import jwt from "jsonwebtoken";

const cookieOptions = {
  secure: true,
  httpOnly: true,
  signed: true,
};

const protectedMiddleware = t.middleware(async ({ ctx, next }) => {
  try {
    const token = ctx.req.signedCookies.token;
    const { sub: id } = jwt.verify(token, process.env.JWT_SECRET!) || {};

    const user = await User.findById(id);

    if (id == null || user == null) {
      throw null;
    }

    return next({ ctx: { user: user.toObject() } });
  } catch {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You have to be logged in to perform this action",
    });
  }
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

async function createToken(sub: string) {
  const token = jwt.sign({ sub }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  return token;
}

async function createRefreshToken(sub: string) {
  const refreshToken = jwt.sign({ sub }, process.env.JWT_REFRESH_SECRET!);

  await User.findByIdAndUpdate(sub, { $set: { refreshToken } });

  return refreshToken;
}

export const users = t.router({
  signup: t.procedure
    .input(
      z.object({
        firstname: z.string(),
        lastname: z.string(),
        email: z.string().email(),
        password: z.string(),
        birthdate: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await User.create(input);

        ctx.res.cookie("token", await createToken(user.id), cookieOptions);
        ctx.res.cookie(
          "refreshToken",
          await createRefreshToken(user.id),
          cookieOptions
        );

        return { ...(await user.toObject()), password: undefined };
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

      ctx.res.cookie("token", await createToken(user.id), cookieOptions);
      ctx.res.cookie(
        "refreshToken",
        await createRefreshToken(user.id),
        cookieOptions
      );

      return { ...(await user.toObject()), password: undefined };
    }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    ctx.res.clearCookie("token");
    ctx.res.clearCookie("refreshToken");

    await User.findByIdAndUpdate(ctx.user._id, {
      $set: { refreshToken: undefined },
    });

    return true;
  }),

  refreshToken: t.procedure.query(async ({ ctx }) => {
    const refreshToken = ctx.req.signedCookies.refreshToken;

    if (refreshToken == null) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You have to be logged in to perform this action",
      });
    }

    if ((await User.findOne({ refreshToken })) == null) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not authorized to perform this action",
      });
    }

    try {
      const { sub: id } =
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) || {};

      if (id == null || typeof id != "string") {
        throw null;
      }

      ctx.res.cookie("token", await createToken(id), cookieOptions);

      return true;
    } catch {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You have to be logged in to perform this action",
      });
    }
  }),

  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    return { ...ctx.user, password: undefined };
  }),
});
