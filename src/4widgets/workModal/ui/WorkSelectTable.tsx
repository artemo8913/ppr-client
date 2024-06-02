"use client";
import { Table as TableAntd, TableProps } from "antd";
import { FC, useState } from "react";
import { IWork, TLineClassData, getWorkById } from "@/2entities/work";

import Button from "antd/es/button";
import { usePprTableData } from "@/1shared/providers/pprTableProvider";
import { useSession } from "next-auth/react";
import { getShortNamesForAllHierarchy } from "@/1shared/lib/transEnergoDivisions";

interface IWorkTableProps {
  data: IWork[];
  onFinish?: () => void;
  indexToPlace?: number;
}

const columns: TableProps<IWork>["columns"] = [
  {
    title: "Наименование работы",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Периодичность",
    dataIndex: "periodicity_normal_data",
    key: "periodicity_normal_data",
    render: (per: TLineClassData) => {
      return Object.entries(per)
        .map((entr) => `${entr[0]}: ${entr[1]}`)
        .join("; ");
    },
  },
  {
    title: "Ед.измерения",
    dataIndex: "measure",
    key: "measure",
  },
  {
    title: "Норма времени",
    dataIndex: "norm_of_time",
    key: "norm_of_time",
  },
  {
    title: "Обоснование нормы времени",
    dataIndex: "norm_of_time_document",
    key: "norm_of_time_document",
  },
];

export const WorkSelectTable: FC<IWorkTableProps> = ({ data, onFinish, indexToPlace }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [workId, setWorkId] = useState<string>();

  const { addWork } = usePprTableData();

  const { data: sessionData } = useSession();
  const userData = sessionData?.user;

  const handleFinish = async () => {
    setIsLoading(true);
    if (!workId) {
      return;
    }
    const work = await getWorkById(workId);
    addWork(
      {
        workId: work.id,
        name: work.name,
        measure: work.measure,
        norm_of_time: work.norm_of_time,
        norm_of_time_document: work.norm_of_time_document,
        unity: (userData && getShortNamesForAllHierarchy(userData).subdivisionShortName) || undefined,
      },
      indexToPlace
    );
    setSelectedRowKeys([]);
    setWorkId(undefined);
    setIsLoading(false);
    onFinish && onFinish();
  };
  return (
    <>
      <TableAntd
        rowSelection={{
          type: "radio",
          onChange: (selectedKeys: React.Key[], selectedRows: IWork[]) => {
            setSelectedRowKeys(selectedKeys);
            setWorkId(selectedRows[0].id);
          },
          selectedRowKeys: selectedRowKeys,
        }}
        dataSource={data}
        columns={columns}
        rowKey={"id"}
      />
      <Button onClick={handleFinish} type="primary" disabled={!Boolean(workId)} loading={isLoading}>
        Добавить
      </Button>
    </>
  );
};
