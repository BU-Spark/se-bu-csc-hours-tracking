import { hostname } from "os";

export default {
  images: {
    // create remote pattern for lh3.googleusercontent.com
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      }
    ],
  },
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