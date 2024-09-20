export default {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  rewrites: async () => [
    {
      source: "/signin",
      destination: "/api/auth/signin",
    },
  ],
};
