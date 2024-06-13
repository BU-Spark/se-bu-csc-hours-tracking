export default {
  rewrites: async () => [
    {
      source: "/signin",
      destination: "/api/auth/signin",
    },
  ],
};
