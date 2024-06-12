import { Session } from "next-auth";
import prisma from "./prisma";
import { Adapter, AdapterUser } from "next-auth/adapters";

export const CustomPrismaAdapter: Adapter = {
  async createUser(profile): Promise<any> {
    try {
      console.log("Creating user with profile:", profile);
      if (profile) {
        const user = await prisma.person.create({
          data: {
            email: profile.email,
            name: profile.name || "",
            image: profile.image,
          },
        });
        console.log("User created:", user);
        // Adapt the user object to match the AdapterUser type
        const currentDate = new Date();
        const adaptedUser: any = {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          phone_number: user.phone_number,
          role: user.role,
          class: user.class,
          affiliation_id: user.affiliation_id,
          emailVerified: currentDate, // Assuming email verification is not implemented here
        };
        return adaptedUser;
      }
      console.error("Error creating user:");
      throw new Error("Error creating user");
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },
  async getUser(id: string): Promise<AdapterUser | null> {
    try {
      const user = await prisma.person.findUnique({
        where: { id: parseInt(id) },
      });
      const currentDate = new Date();
      return user
        ? {
            ...user,
            id: user.id.toString(),
            image: user.image || undefined,
            emailVerified: currentDate,
          }
        : null;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },
  async getUserByEmail(email: string): Promise<AdapterUser | null> {
    try {
      const user = await prisma.person.findUnique({
        where: { email },
      });
      const currentDate = new Date();
      return user
        ? {
            ...user,
            id: user.id.toString(),
            emailVerified: currentDate,
            image: user.image || undefined,
          }
        : null;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw error;
    }
  },
  async updateUser(user): Promise<AdapterUser> {
    try {
      const updatedUser = await prisma.person.update({
        where: { id: parseInt(user.id) },
        data: {
          email: user.email,
          name: user.name,
          image: user.image || undefined,
        },
      });
      return {
        ...updatedUser,
        id: updatedUser.id.toString(),
        emailVerified: new Date(),
        image: user.image || undefined,
      };
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<AdapterUser> {
    try {
      const deletedUser = await prisma.person.delete({
        where: { id: parseInt(userId) },
      });
      return {
        ...deletedUser,
        id: deletedUser.id.toString(),
        emailVerified: new Date(),
        image: deletedUser.image || undefined,
      };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  async linkAccount(account): Promise<any> {
    try {
      console.log("Linking account:", account);
      const linkedAccount = await prisma.account.create({
        data: {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
          userId: parseInt(account.userId),
          type: account.type,
        },
      });
      console.log("Account linked:", linkedAccount);
      return linkedAccount;
    } catch (error) {
      console.error("Error linking account:", error);
      throw error;
    }
  },

  async unlinkAccount({
    provider,
    providerAccountId,
  }: Pick<any, "provider" | "providerAccountId">): Promise<
    void | any | undefined
  > {
    try {
      const unlinkedAccount = await prisma.account.delete({
        where: { provider_providerAccountId: { provider, providerAccountId } },
      });
      return unlinkedAccount;
    } catch (error) {
      console.error("Error unlinking account:", error);
      throw error;
    }
  },

  async getSessionAndUser(
    sessionToken: string
  ): Promise<{ session: any | null; user: AdapterUser | null }> {
    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (!session) return { session: null, user: null };
      const user = {
        ...session.user,
        id: session.user.id.toString(),
        emailVerified: new Date(),
        image: session.user.image || undefined,
      };
      return { session, user };
    } catch (error) {
      console.error("Error getting session and user:", error);
      throw error;
    }
  },

  async createSession(session): Promise<any> {
    try {
      const newSession = await prisma.session.create({
        data: session,
      });
      return newSession;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  },

  async updateSession(session): Promise<any> {
    try {
      const updatedSession = await prisma.session.update({
        where: { sessionToken: session.sessionToken },
        data: session,
      });
      return updatedSession;
    } catch (error) {
      console.error("Error updating session:", error);
      throw error;
    }
  },

  async deleteSession(sessionToken: string): Promise<any> {
    try {
      const deletedSession = await prisma.session.delete({
        where: { sessionToken },
      });
      return deletedSession;
    } catch (error) {
      console.error("Error deleting session:", error);
      throw error;
    }
  },

  async getUserByAccount({
    provider,
    providerAccountId,
  }): Promise<AdapterUser | null> {
    try {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
        include: {
          user: true,
        },
      });
      if (!account) return null;
      const user = {
        ...account.user,
        id: account.user.id.toString(),
        emailVerified: new Date(),
        image: account.user.image || undefined,
      };
      return user;
    } catch (error) {
      console.error("Error getting user by account:", error);
      throw error;
    }
  },
};
