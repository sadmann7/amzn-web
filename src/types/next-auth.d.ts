import type { USER_ROLE } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User extends DefaultUser {
    id: string;
    role: USER_ROLE;
    active: boolean;
  }
  interface Session {
    user?: User;
  }
}
