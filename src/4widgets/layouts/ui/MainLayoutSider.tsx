"use client";
import Link from "next/link";
import { Menu, MenuProps } from "antd";
import React, { useState } from "react";
import Sider from "antd/es/layout/Sider";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { BarChartOutlined, HomeFilled, LogoutOutlined, TableOutlined } from "@ant-design/icons";

import { ROUTE_PPR, ROUTE_REPORTS, ROUTE_ROOT } from "@/1shared/lib/routes";

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
  getItem(<Link href={ROUTE_PPR}>Планы ТОиР</Link>, "ppr", <TableOutlined />),
  getItem(<Link href={ROUTE_REPORTS}>Отчеты</Link>, "reports", <BarChartOutlined />),
  getItem(<a onClick={() => signOut({ callbackUrl: ROUTE_ROOT })}>Выйти</a>, "logout", <LogoutOutlined />),
];

export const MainLayoutSider = ({ className }: { className: string }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const pathname = usePathname();

  const findDefaultSelectedKey = () => {
    for (let i = 0; i < items.length; i++) {
      if (pathname === "/") {
        return ["home"];
      }
      if (pathname.startsWith(`/${items[i]?.key}`)) {
        return [String(items[i]?.key)];
      }
    }
  };

  return (
    <Sider className={className} collapsible collapsed={isCollapsed} onCollapse={(value) => setIsCollapsed(value)}>
      <Menu defaultSelectedKeys={findDefaultSelectedKey()} theme="dark" mode="inline" items={items} />
    </Sider>
  );
};
