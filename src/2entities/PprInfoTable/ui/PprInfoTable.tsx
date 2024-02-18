"use client";
import { FC } from "react";
import { IPprInfo } from "../model/pprInfo.shema";
import { Table, TableProps } from "antd";
import { directions } from "@/1shared/types/transEnergoDivisions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SessionProvider, useSession } from "next-auth/react";

interface IPprInfoProps {
  data: IPprInfo[];
}

const columns: TableProps<IPprInfo>["columns"] = [
  {
    title: "Наименование",
    dataIndex: "name",
    key: "name",
    render: (value, record, index) => <Link href={`ppr/${record.id}`}>{value}</Link>,
  },
  {
    title: "Год",
    dataIndex: "year",
    key: "year",
  },
  {
    title: "Подразделение",
    dataIndex: "id_subdivision",
    key: "id_subdivision",
    render: (_, data) =>
      directions[data.id_direction].distances[data.id_distance].subdivisions[data.id_subdivision].short_name,
  },
  {
    title: "Дистанция",
    dataIndex: "id_distance",
    key: "id_distance",
    render: (_, data) => directions[data.id_direction].distances[data.id_distance].short_name,
  },
  {
    title: "Дирекция",
    dataIndex: "id_direction",
    key: "id_direction",
    render: (_, data) => directions[data.id_direction].short_name,
  },
];

export const PprInfoTable: FC<IPprInfoProps> = ({ data }) => {
  return <Table dataSource={data} columns={columns} rowKey="id"/>;
};
