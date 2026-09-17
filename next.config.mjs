const nextConfig = {
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  experimental: {
    serverComponentsExternalPackages: [
      "@prisma/client",
      "@prisma/adapter-better-sqlite3",
      "better-sqlite3",
    ],
  },
};

export default nextConfig;
