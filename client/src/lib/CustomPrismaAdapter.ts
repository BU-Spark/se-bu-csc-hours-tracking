import { PrismaClient } from "@prisma/client";
import { Adapter, AdapterUser, AdapterSession } from "next-auth/adapters";
import { Session, User, Account } from "next-auth";

const prisma = new PrismaClient();

export const CustomPrismaAdapter: Adapter = {
  async createUser(profile): Promise<AdapterUser> {
    try {
      const user = await prisma.person.create({
        data: {
          email: profile.email,
          name: profile.name || "",
          image: profile.image,
        },
      });

      return {
        id: user.id.toString(),
        email: user.email,
        emailVerified: null,
        name: user.name,
        image: user.image || undefined,
      };
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

      return user
        ? {
            id: user.id.toString(),
            email: user.email,
            emailVerified: null,
            name: user.name,
            image: user.image || undefined,
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

      return user
        ? {
            id: user.id.toString(),
            email: user.email,
            emailVerified: null,
            name: user.name,
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
        id: updatedUser.id.toString(),
        email: updatedUser.email,
        emailVerified: null,
        name: updatedUser.name,
        image: updatedUser.image || undefined,
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
        id: deletedUser.id.toString(),
        email: deletedUser.email,
        emailVerified: null,
        name: deletedUser.name,
        image: deletedUser.image || undefined,
      };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  async linkAccount(account): Promise<any> {
    try {
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

      return linkedAccount;
    } catch (error) {
      console.error("Error linking account:", error);
      throw error;
    }
  },

  async unlinkAccount({ provider, providerAccountId }): Promise<void | any> {
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

  async getSessionAndUser(sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser }> {
    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });

      if (!session) {
        return {
          session: {
            sessionToken: "",
            userId: "",
            expires: new Date(),
          },
          user: {
            id: "",
            email: "",
            emailVerified: null,
            name: "",
            image: "",
          },
        };
      }

      const user: AdapterUser = {
        id: session.user.id.toString(),
        email: session.user.email,
        emailVerified: null,
        name: session.user.name,
        image: session.user.image || undefined,
      };

      return {
        session: {
          sessionToken: session.sessionToken,
          userId: session.userId.toString(),
          expires: session.expires,
        },
        user,
      };
    } catch (error) {
      console.error("Error getting session and user:", error);
      throw error;
    }
  },

  async createSession(session): Promise<AdapterSession> {
    try {
      if (!session.userId) {
        throw new Error("User ID is undefined");
      }
      
      const newSession = await prisma.session.create({
        data: {
          sessionToken: session.sessionToken,
          userId: parseInt(session.userId),
          expires: session.expires,
        },
      });

      return {
        sessionToken: newSession.sessionToken,
        userId: newSession.userId.toString(),
        expires: newSession.expires,
      };
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  },

  async updateSession(session): Promise<AdapterSession> {
    try {
      if (!session.userId) {
        throw new Error("User ID is undefined");
      }
      
      const updatedSession = await prisma.session.update({
        where: { sessionToken: session.sessionToken },
        data: {
          userId: parseInt(session.userId),
          expires: session.expires,
        },
      });

      return {
        sessionToken: updatedSession.sessionToken,
        userId: updatedSession.userId.toString(),
        expires: updatedSession.expires,
      };
    } catch (error) {
      console.error("Error updating session:", error);
      throw error;
    }
  },

  async deleteSession(sessionToken: string): Promise<void> {
    try {
      await prisma.session.delete({
        where: { sessionToken },
      });
    } catch (error) {
      console.error("Error deleting session:", error);
      throw error;
    }
  },

  async getUserByAccount({ provider, providerAccountId }): Promise<AdapterUser | null> {
    try {
      const account = await prisma.account.findUnique({
        where: { provider_providerAccountId: { provider, providerAccountId } },
        include: { user: true },
      });

      if (!account) return null;

      const user: AdapterUser = {
        id: account.user.id.toString(),
        email: account.user.email,
        emailVerified: null,
        name: account.user.name,
        image: account.user.image || undefined,
      };

      return user;
    } catch (error) {
      console.error("Error getting user by account:", error);
      throw error;
    }
  },
};