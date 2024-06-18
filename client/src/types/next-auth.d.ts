import { Role } from "@prisma/client";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    role?: Role;
  }

  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      role?: Role;
    };
  }

  interface JWT {
    id: string;
  }
}
