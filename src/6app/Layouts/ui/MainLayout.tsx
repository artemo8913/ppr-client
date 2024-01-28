import { MainLayoutSider } from "@/1shared/ui/Sider";
import { Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <MainLayoutSider />
        <Content className="mx-3 my-1">
          <div className="w-full h-full overflow-hidden">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
