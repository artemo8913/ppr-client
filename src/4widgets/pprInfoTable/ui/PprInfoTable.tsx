"use client";
import { FC } from "react";
import Link from "next/link";
import { Badge, Table, TableProps } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { directions } from "@/1shared/types/transEnergoDivisions";
import { IPpr, deletePprTable } from "@/1shared/api/pprTable";
import { PprDeleteButton } from "@/3features/pprDeleteTable";
import { months, monthsIntlRu } from "@/1shared/types/date";

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
            <div className="flex min-w-3 flex-col justify-center items-center" key={month}>
              <span>{monthsIntlRu[month][0]}</span>
              <Badge
                key={month}
                status={
                  data.months_statuses[month] === "none"
                    ? "default"
                    : data.months_statuses[month] === "done"
                    ? "success"
                    : data.months_statuses[month] === "fact_filling"
                    ? "processing"
                    : data.months_statuses[month] === "plan_on_correction"
                    ? "error"
                    : data.months_statuses[month] === "plan_aproved"
                    ? "processing"
                    : "warning"
                }
              />
            </div>
          ))}
        </div>
      );
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
