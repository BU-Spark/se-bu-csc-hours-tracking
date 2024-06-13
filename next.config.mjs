export default {
  typescript: {
    ignoreBuildErrors: true,
  },
  rewrites: async () => [
    {
      source: "/signin",
      destination: "/api/auth/signin",
    },
  ],
};
