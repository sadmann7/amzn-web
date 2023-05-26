// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
    images: {
    // image optimization is disabled because of exceeding the vercel hobby tier limit
    unoptimized: true,
    domains: ["fakestoreapi.com", "res.cloudinary.com"],
  },
};
export default config;
