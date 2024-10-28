"use client";
import { FC } from "react";
import Link from "next/link";
import { Table, TableProps } from "antd";

import { MONTHS } from "@/1shared/const/date";
import { translateRuYearStatus } from "@/1shared/locale/pprStatus";
import { TPprShortInfo } from "@/2entities/ppr";
import { PprDeleteButton } from "@/3features/ppr/delete";
import { PprCopyButton } from "@/3features/ppr/copy";

import { PprMonthsInfoBadge } from "./PprMonthsInfoBadge";

interface IPprInfoProps {
  data: TPprShortInfo[];
}

const columns: TableProps<TPprShortInfo>["columns"] = [
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
    dataIndex: "idSubdivision",
    key: "idSubdivision",
    render: (_, data) => data.subdivisionShortName || "-",
  },
  {
    title: "Дистанция",
    dataIndex: "idDistance",
    key: "idDistance",
    render: (_, data) => data.distanceShortName || "-",
  },
  {
    title: "Дирекция",
    dataIndex: "idDirection",
    key: "idDirection",
    render: (_, data) => data.directionShortName || "-",
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
