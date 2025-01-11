"use client";
import { useState } from "react";
import { Menu, MenuProps } from "antd";
import { BarChartOutlined, HomeFilled, LogoutOutlined, TableOutlined } from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import Link from "next/link";
import { signOut } from "next-auth/react";

import { ROUTE_PPR, ROUTE_REPORTS, ROUTE_ROOT } from "@/1shared/const/routes";

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
  getItem(<Link href={ROUTE_ROOT}>Главная</Link>, "home", <HomeFilled />),
  getItem(<Link href={ROUTE_PPR}>Годовые планы</Link>, "year", <TableOutlined />),
  getItem(<Link href={ROUTE_REPORTS}>Отчеты</Link>, "reports", <BarChartOutlined />),
  getItem(<a onClick={() => signOut({ callbackUrl: ROUTE_ROOT })}>Выйти</a>, "logout", <LogoutOutlined />),
];

export const MainLayoutSider = ({ className }: { className: string }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <Sider className={className} collapsible collapsed={isCollapsed} onCollapse={(value) => setIsCollapsed(value)}>
      <Menu theme="dark" mode="inline" items={items} />
    </Sider>
  );
};
