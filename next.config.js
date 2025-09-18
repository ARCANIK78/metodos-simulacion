/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",          // 🔑 Genera HTML estático
  images: { unoptimized: true }, // Evita problemas con <Image />
  basePath: "/NOMBRE_REPO",  // 👈 cambia por el nombre de tu repo en GitHub
  assetPrefix: "/NOMBRE_REPO/",
};

module.exports = nextConfig;
