"use client";
import { FC, useState } from "react";
import { Menu, MenuProps } from "antd";
import {
  BarChartOutlined,
  DesktopOutlined,
  FileOutlined,
  HomeFilled,
  PieChartOutlined,
  TableOutlined,
  TabletFilled,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import Link from "next/link";

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
  getItem("Планы", "pprs", <TableOutlined />, [
    getItem(<Link href={"/ppr"}>Годовые планы</Link>, "year"),
    getItem(<Link href={"/"}>Месячные планы</Link>, "mounth"),
  ]),
  getItem(<Link href={"/reports"}>Отчеты</Link>, "reports", <BarChartOutlined />),
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
