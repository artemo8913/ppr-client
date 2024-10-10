"use client";
import { FC, useState } from "react";
import { useSession } from "next-auth/react";
import { Table as TableAntd, TableProps } from "antd";
import Button from "antd/es/button";
import Select from "antd/es/select";

import { BRANCH_SELECT_OPTIONS } from "@/1shared/form/branchSelectOptions";
import { usePpr } from "@/1shared/providers/pprProvider";
import { ICommonWork, getOneCommonWorkById } from "@/2entities/commonWork";
import { TPprDataWorkId, TWorkBranch } from "@/2entities/ppr";

interface IWorkTableProps {
  data: ICommonWork[];
  onFinish?: () => void;
  nearWorkId?: TPprDataWorkId | null;
}

const columns: TableProps<ICommonWork>["columns"] = [
  {
    title: "Наименование работы",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Ед.измерения",
    dataIndex: "measure",
    key: "measure",
  },
  {
    title: "Норма времени",
    dataIndex: "normOfTime",
    key: "normOfTime",
  },
  {
    title: "Обоснование нормы времени",
    dataIndex: "normOfTimeNameFull",
    key: "normOfTimeNameFull",
  },
];

export const WorkSelectTable: FC<IWorkTableProps> = ({ data, onFinish, nearWorkId }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [workId, setWorkId] = useState<number | null>();
  const [branch, setBranch] = useState<TWorkBranch>("exploitation");
  const [subbranch, setSubbranch] = useState<string[]>([]);

  const { addWork, getBranchesMeta } = usePpr();
  const { subbranchesList } = getBranchesMeta();

  const subbranchOptions = subbranchesList?.map((subbranch) => {
    return { value: subbranch, label: subbranch };
  });

  const { data: session } = useSession();
  const user = session?.user;

  const handleFinish = async () => {
    setIsLoading(true);
    if (!workId) {
      return;
    }

    const work = await getOneCommonWorkById(workId);

    addWork(
      {
        common_work_id: work.id,
        name: work.name,
        branch,
        subbranch: subbranch[0],
        measure: work.measure,
        norm_of_time: work.normOfTime,
        norm_of_time_document: work.normOfTimeNameFull,
        unity: user?.subdivisionShortName,
      },
      nearWorkId
    );
    setSelectedRowKeys([]);
    setWorkId(null);
    setIsLoading(false);
    onFinish && onFinish();
  };

  return (
    <div className="flex flex-col">
      <TableAntd
        rowSelection={{
          type: "radio",
          onChange: (selectedKeys: React.Key[], selectedRows: ICommonWork[]) => {
            setSelectedRowKeys(selectedKeys);
            setWorkId(selectedRows[0].id);
          },
          selectedRowKeys: selectedRowKeys,
        }}
        dataSource={data}
        columns={columns}
        rowKey={"id"}
      />
      <label className="flex align-center">
        Категория работ:
        <Select value={branch} onChange={setBranch} options={BRANCH_SELECT_OPTIONS} />
      </label>
      <label className="flex align-center">
        Подкатегория работ:
        <Select mode="tags" maxCount={1} value={subbranch} onChange={setSubbranch} options={subbranchOptions} />
      </label>
      <Button onClick={handleFinish} type="primary" disabled={!Boolean(workId)} loading={isLoading}>
        Добавить
      </Button>
    </div>
  );
};
