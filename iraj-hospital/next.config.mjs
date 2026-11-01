/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    return config;
  },
  async redirects() {
    return [
      {
        source: "/team",
        destination: "/our-team",
        permanent: true,
      },
      {
        source: "/team/:slug",
        destination: "/our-team/:slug",
        permanent: true,
      },
      {
        source: "/faqs",
        destination: "/faq",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
