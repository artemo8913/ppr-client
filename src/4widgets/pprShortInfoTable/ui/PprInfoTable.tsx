"use client";
import { FC } from "react";
import Link from "next/link";
import { Table, TableProps } from "antd";

import { MONTHS } from "@/1shared/const/date";
import { getStatusText } from "@/1shared/providers/pprProvider/lib/pprStatusHelper";
import { usePprSearchTransition } from "@/1shared/providers/pprSearchTransitionProvider";
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
    render: (_, pprInfo) => <Link href={`ppr/${pprInfo.id}`}>{pprInfo.name}</Link>,
  },
  {
    title: "Год",
    dataIndex: "year",
    key: "year",
  },
  {
    title: "Дирекция",
    dataIndex: "idDirection",
    key: "idDirection",
    render: (_, pprInfo) => pprInfo.directionShortName || "-",
  },
  {
    title: "Дистанция",
    dataIndex: "idDistance",
    key: "idDistance",
    render: (_, pprInfo) => pprInfo.distanceShortName || "-",
  },
  {
    title: "Подразделение",
    dataIndex: "idSubdivision",
    key: "idSubdivision",
    render: (_, pprInfo) => pprInfo.subdivisionShortName || "-",
  },
  {
    title: "Статус ЭУ-132",
    dataIndex: "status",
    key: "status",
    render: (_, pprInfo) => getStatusText(pprInfo),
  },
  {
    title: "Статусы месячного планирования",
    dataIndex: "months_statuses",
    key: "months_statuses",
    render: (_, pprInfo) => {
      return (
        <div className="flex flex-row">
          {MONTHS.map((month) => (
            <PprMonthsInfoBadge key={month} month={month} monthStatus={pprInfo.months_statuses[month]} />
          ))}
        </div>
      );
    },
  },
  {
    title: "Действия",
    dataIndex: "id",
    render: (_, pprInfo) => (
      <>
        <PprDeleteButton created_by={pprInfo.created_by} pprId={pprInfo.id} pprStatus={pprInfo.status} />
        <PprCopyButton pprId={pprInfo.id} />
      </>
    ),
  },
];

export const PprInfoTable: FC<IPprInfoProps> = ({ data }) => {
  const { isLoading } = usePprSearchTransition();

  return (
    <Table
      pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: [5, 10, 50, 100] }}
      loading={isLoading}
      dataSource={data}
      columns={columns}
      rowKey="id"
    />
  );
};
