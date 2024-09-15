"use client";
import { FC } from "react";
import Link from "next/link";
import { Table, TableProps } from "antd";
import { getShortNamesForAllDivisions } from "@/1shared/lib/transEnergoDivisions";
import { MONTHS } from "@/1shared/lib/date";
import { IPpr } from "@/2entities/ppr";
import { PprDeleteButton } from "@/3features/ppr/delete";
import { PprMonthsInfoBadge } from "./PprMonthsInfoBadge";
import { translateRuYearStatus } from "@/1shared/providers/pprProvider/lib/pprStatusHelper";
import { PprCopyButton } from "@/3features/ppr/copy";

interface IPprInfoProps {
  data: Omit<IPpr, "data">[];
}

const columns: TableProps<Omit<IPpr, "data">>["columns"] = [
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
    render: (_, data) => getShortNamesForAllDivisions(data).subdivisionShortName || "-",
  },
  {
    title: "Дистанция",
    dataIndex: "id_distance",
    key: "id_distance",
    render: (_, data) => getShortNamesForAllDivisions(data).distanceShortName || "-",
  },
  {
    title: "Дирекция",
    dataIndex: "id_direction",
    key: "id_direction",
    render: (_, data) => getShortNamesForAllDivisions(data).directionShortName || "-",
  },
  {
    title: "Статус",
    dataIndex: "status",
    key: "status",
    render: (value) => translateRuYearStatus(value),
  },
  {
    title: "Месяцы",
    dataIndex: "months_statuses",
    key: "months_statuses",
    render: (_, data) => {
      return (
        <div className="flex flex-row">
          {MONTHS.map((month) => (
            <PprMonthsInfoBadge key={month} month={month} monthStatus={data.months_statuses[month]} />
          ))}
        </div>
      );
    },
  },
  {
    title: "Действия",
    dataIndex: "id",
    render: (_, row) => (
      <>
        <PprDeleteButton created_by={row.created_by} pprId={row.id} pprStatus={row.status} />
        <PprCopyButton pprId={row.id} />
      </>
    ),
  },
];

export const PprInfoTable: FC<IPprInfoProps> = ({ data }) => {
  return <Table dataSource={data} columns={columns} rowKey="id" />;
};
