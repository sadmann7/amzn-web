import type { Order, USER_ROLE } from "@prisma/client";
import type { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: USER_ROLE;
    active: boolean;
    orders: Order[];
  }
  interface Session {
    user?: User;
  }
}
