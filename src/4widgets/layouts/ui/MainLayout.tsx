import { MainLayoutSider } from "@/1shared/ui/siders";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout hasSider style={{ height: "100vh" }}>
      <MainLayoutSider />
      <Content className="mx-2 my-2 overflow-hidden">{children}</Content>
    </Layout>
  );
}
