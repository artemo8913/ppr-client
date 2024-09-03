/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "rc-util",
    "@ant-design",
    "kitchen-flow-editor",
    "@ant-design/pro-editor",
    "zustand",
    "leva",
    "antd",
    "rc-pagination",
    "rc-picker",
  ],
  compress: false,
  webpack: (config) => {
    return {
      ...config,
      optimization: {
        minimize: false,
      },
    };
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["pprclienttrans.ru"],
    },
  },
};

module.exports = nextConfig;
