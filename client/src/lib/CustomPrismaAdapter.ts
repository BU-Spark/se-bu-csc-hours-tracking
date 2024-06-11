import prisma from './prisma';
import { Adapter } from 'next-auth/adapters';

export const CustomPrismaAdapter: Adapter = {
  async createUser(profile) {
    try {
      console.log('Creating user with profile:', profile);
      const user = await prisma.person.create({
        data: {
          email: profile.email,
          name: profile.name,
          image: profile.image,
        },
      });
      console.log('User created:', user);
      return { ...user, id: user.id.toString() };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  async getUser(id) {
    const user = await prisma.person.findUnique({
      where: { id: parseInt(id) },
    });
    return user ? { ...user, id: user.id.toString() } : null;
  },
  async getUserByEmail(email) {
    const user = await prisma.person.findUnique({
      where: { email },
    });
    return user ? { ...user, id: user.id.toString() } : null;
  },
  async updateUser(user) {
    const updatedUser = await prisma.person.update({
      where: { id: parseInt(user.id) },
      data: {
        email: user.email,
        name: user.name,
        image: user.image,
      },
    });
    return { ...updatedUser, id: updatedUser.id.toString() };
  },
  async deleteUser(userId) {
    const deletedUser = await prisma.person.delete({
      where: { id: parseInt(userId) },
    });
    return { ...deletedUser, id: deletedUser.id.toString() };
  },
  async linkAccount(account) {
    try {
      console.log('Linking account:', account);
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
      console.log('Account linked:', linkedAccount);
      return linkedAccount;
    } catch (error) {
      console.error('Error linking account:', error);
      throw error;
    }
  },
  async unlinkAccount(accountId) {
    const unlinkedAccount = await prisma.account.delete({
      where: { id: accountId },
    });
    return unlinkedAccount;
  },
  async getSessionAndUser(sessionToken) {
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });
    if (!session) return null;
    const user = { ...session.user, id: session.user.id.toString() };
    return { session, user };
  },
  async createSession(session) {
    const newSession = await prisma.session.create({
      data: session,
    });
    return newSession;
  },
  async updateSession(session) {
    const updatedSession = await prisma.session.update({
      where: { sessionToken: session.sessionToken },
      data: session,
    });
    return updatedSession;
  },
  async deleteSession(sessionToken) {
    const deletedSession = await prisma.session.delete({
      where: { sessionToken },
    });
    return deletedSession;
  },
  async getUserByAccount({ provider, providerAccountId }) {
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
    const user = { ...account.user, id: account.user.id.toString() };
    return user;
  },
};
