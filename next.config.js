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
  experimental: {
    serverActions: {
      allowedOrigins: ["pprclienttrans.ru", "localhost:3000", "http://127.0.0.1:3000"],
      bodySizeLimit: "10mb",
    },
  },
};

module.exports = nextConfig;
