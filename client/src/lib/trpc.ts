import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../server/index";

export const t = createTRPCReact<AppRouter>();
