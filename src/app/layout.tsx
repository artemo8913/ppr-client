import type { Metadata } from "next";
import { getServerSession } from "next-auth";
// import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import { NotificationProvider } from "@/1shared/providers/notificationProvider";
import { SessionProvider } from "@/1shared/providers/sessionProvider";
import { authOptions } from "@/1shared/auth/authConfig";
import { MainLayout } from "@/4widgets/layouts";
import { LoginPage } from "@/5pages/loginPage";

import "./globals.scss";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Цифровой ППР",
  description: "АС создания и ведения эксплуатационных планов Трансэнерго",
};

interface IRootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout(props: IRootLayoutProps) {
  const user = await getServerSession(authOptions);

  return (
    <html lang="ru">
      <body>
        <AntdRegistry>
          <SessionProvider>
            <NotificationProvider>
              {user ? <MainLayout>{props.children}</MainLayout> : <LoginPage />}
            </NotificationProvider>
          </SessionProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
