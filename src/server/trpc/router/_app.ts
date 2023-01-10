import { router } from "../trpc";
import { adminRouter } from "./admin";
import { ordersRouter } from "./orders";
import { productsRouter } from "./products";
import { usersRouter } from "./users";

export const appRouter = router({
  users: usersRouter,
  products: productsRouter,
  orders: ordersRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
