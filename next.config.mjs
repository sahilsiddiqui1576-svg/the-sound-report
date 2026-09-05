/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" } // covers editor-uploaded cover images from any host
    ]
  },
  eslint: { ignoreDuringBuilds: false }
};

export default nextConfig;
