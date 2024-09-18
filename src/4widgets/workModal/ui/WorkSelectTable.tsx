"use client";
import { FC, useState } from "react";
import { useSession } from "next-auth/react";
import { Table as TableAntd, TableProps } from "antd";
import Button from "antd/es/button";
import Select from "antd/es/select";

import { usePpr } from "@/1shared/providers/pprProvider";
import { getShortNamesForAllDivisions } from "@/1shared/lib/transEnergoDivisions";
import { IWork, TLineClassData, getWorkById } from "@/2entities/work";
import { TWorkBranch } from "@/2entities/ppr";
import { BRANCH_SELECT_OPTIONS } from "../../../1shared/form/branchSelectOptions";

interface IWorkTableProps {
  data: IWork[];
  onFinish?: () => void;
  nearWorkId?: string | null;
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

export const WorkSelectTable: FC<IWorkTableProps> = ({ data, onFinish, nearWorkId }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [workId, setWorkId] = useState<string | null>();
  const [branch, setBranch] = useState<TWorkBranch>("exploitation");

  const { addWork } = usePpr();

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
        branch,
        measure: work.measure,
        norm_of_time: work.norm_of_time,
        norm_of_time_document: work.norm_of_time_document,
        unity: userData && getShortNamesForAllDivisions(userData).subdivisionShortName,
      },
      nearWorkId
    );
    setSelectedRowKeys([]);
    setWorkId(null);
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
      <Select<TWorkBranch> value={branch} onChange={setBranch} options={BRANCH_SELECT_OPTIONS} />
      <Button onClick={handleFinish} type="primary" disabled={!Boolean(workId)} loading={isLoading}>
        Добавить
      </Button>
    </>
  );
};
