import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";

import { MainLayoutSider } from "@/1shared/ui/siders";

import style from "./MainLayout.module.scss";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout hasSider className={style.MainLayout}>
      <MainLayoutSider className={style.Sider} />
      <Content className="mx-2 my-2 flex flex-col overflow-hidden print:overflow-visible">{children}</Content>
    </Layout>
  );
}
