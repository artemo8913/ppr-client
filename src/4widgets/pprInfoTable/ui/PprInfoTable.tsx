"use client";
import { FC } from "react";
import Link from "next/link";
import { Table, TableProps } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { directions } from "@/1shared/types/transEnergoDivisions";
import { IPpr, deletePprTable } from "@/1shared/api/pprTable";
import { PprDeleteButton } from "@/3features/pprDeleteTable";

interface IPprInfoProps {
  data: IPpr[];
}

const columns: TableProps<IPpr>["columns"] = [
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
    render: (_, data) => {
      if (!data.id_direction || !data.id_distance || !data.id_subdivision) {
        return "-";
      }
      return directions[data.id_direction].distances[data.id_distance].subdivisions[data.id_subdivision].short_name;
    },
  },
  {
    title: "Дистанция",
    dataIndex: "id_distance",
    key: "id_distance",
    render: (_, data) => {
      if (!data.id_direction || !data.id_distance) {
        return "-";
      }
      return directions[data.id_direction].distances[data.id_distance].short_name;
    },
  },
  {
    title: "Дирекция",
    dataIndex: "id_direction",
    key: "id_direction",
    render: (_, data) => {
      if (!data.id_direction) {
        return "-";
      }
      return directions[data.id_direction].short_name;
    },
  },
  {
    title: "Действия",
    dataIndex: "id",
    render: (id, row) => <PprDeleteButton ppr={row} />,
  },
];

export const PprInfoTable: FC<IPprInfoProps> = ({ data }) => {
  return <Table dataSource={data} columns={columns} rowKey="id" />;
};
