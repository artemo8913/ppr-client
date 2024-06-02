"use client";
import { FC } from "react";
import Link from "next/link";
import { Table, TableProps } from "antd";
import { directionsMock, getShortNamesForAllHierarchy } from "@/1shared/lib/transEnergoDivisions";
import { months } from "@/1shared/lib/date";
import { IPpr } from "@/2entities/ppr";
import { PprDeleteButton } from "@/3features/ppr/delete";
import { PprMonthsInfoBadge } from "./PprMonthsInfoBadge";

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
    render: (_, data) => getShortNamesForAllHierarchy(data).subdivisionShortName || "-",
  },
  {
    title: "Дистанция",
    dataIndex: "id_distance",
    key: "id_distance",
    render: (_, data) => getShortNamesForAllHierarchy(data).distanceShortName || "-",
  },
  {
    title: "Дирекция",
    dataIndex: "id_direction",
    key: "id_direction",
    render: (_, data) => getShortNamesForAllHierarchy(data).directionShortName || "-",
  },
  {
    title: "Статус",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Месяцы",
    dataIndex: "months_statuses",
    key: "months_statuses",
    render: (_, data) => {
      return (
        <div className="flex flex-row">
          {months.map((month) => (
            <PprMonthsInfoBadge key={month} month={month} monthStatus={data.months_statuses[month]} />
          ))}
        </div>
      );
    },
  },
  {
    title: "Действия",
    dataIndex: "id",
    render: (_, row) => <PprDeleteButton ppr={row} />,
  },
];

export const PprInfoTable: FC<IPprInfoProps> = ({ data }) => {
  return <Table dataSource={data} columns={columns} rowKey="id" />;
};
