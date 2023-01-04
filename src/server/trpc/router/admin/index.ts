import { router } from "../../trpc";
import { productsAdminRouter } from "./products";

export const adminRouter = router({
  products: productsAdminRouter,
});
