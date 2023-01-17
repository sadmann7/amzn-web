import { router } from "../../trpc";
import { ordersAdminRouter } from "./orders";
import { productsAdminRouter } from "./products";
import { usersAdminRouter } from "./users";

export const adminRouter = router({
  users: usersAdminRouter,
  products: productsAdminRouter,
  orders: ordersAdminRouter,
});
