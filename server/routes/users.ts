import { t } from "../trpc";
import { z } from "zod";
import { User } from "../models/User";

export const users = t.router({
  helloClient: t.procedure.query(() => {
    return "Hello Client!";
  }),
  helloServer: t.procedure
    .input(z.object({ message: z.string() }))
    .mutation((req) => {
      console.log(req.input.message);
      return true;
    }),
});
