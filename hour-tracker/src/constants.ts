export const API_URL: string =
  process.env.NODE_ENV === "production"
    ? "https://bu-csc-dev.netlify.app/"
    : "http://localhost:3000";
