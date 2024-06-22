"use client";
import { FC, useState } from "react";
import { Menu, MenuProps } from "antd";
import {
  AuditOutlined,
  BarChartOutlined,
  DotChartOutlined,
  HomeFilled,
  LogoutOutlined,
  TableOutlined,
} from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import Link from "next/link";
import { signOut } from "next-auth/react";

type MenuItem = Required<MenuProps>["items"][number];
function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(<Link href={"/"}>Главная</Link>, "home", <HomeFilled />),
  getItem(<Link href={"/ppr"}>Годовые планы</Link>, "year", <TableOutlined />),
  getItem(<Link href={"/agreement"}>На согласовании / утверждении</Link>, "agreement", <AuditOutlined />),
  getItem(<Link href={"/reports"}>Отчеты</Link>, "reports", <BarChartOutlined />),
  getItem(<a onClick={() => signOut()}>Выйти</a>, "logout", <LogoutOutlined />),
];

interface ISiderProps {}
export const MainLayoutSider: FC<ISiderProps> = () => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <Menu theme="dark" mode="inline" items={items} />
    </Sider>
  );
};
