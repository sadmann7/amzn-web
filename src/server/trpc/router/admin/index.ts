import { router } from "../../trpc";
import { productsAdminRouter } from "./products";
import { usersAdminRouter } from "./users";

export const adminRouter = router({
  users: usersAdminRouter,
  products: productsAdminRouter,
});
