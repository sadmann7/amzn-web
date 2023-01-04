import { router } from "../trpc";
import { authRouter } from "./auth";
import { productsRouter } from "./products";
import { usersRouter } from "./users";
import { adminRouter } from "./admin";

export const appRouter = router({
  auth: authRouter,
  users: usersRouter,
  products: productsRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
