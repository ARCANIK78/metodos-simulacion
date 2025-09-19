/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",          // 🔑 Genera HTML estático
  images: { unoptimized: true }, // Evita problemas con <Image />
  basePath: "/metodos-simulacion",  // 👈 cambia por el nombre de tu repo en GitHub
  assetPrefix: "/metodos-simulacion/",
};

module.exports = nextConfig;
