"use client";
import { useSession } from "next-auth/react";
import { FC, useEffect, useMemo, useState } from "react";
import Button from "antd/es/button";
import { Table as TableAntd, TableProps } from "antd";
import Search, { SearchProps } from "antd/es/input/Search";
import Select, { DefaultOptionType } from "antd/es/select";
import { Key, TableRowSelection } from "antd/es/table/interface";

import { BRANCH_SELECT_OPTIONS } from "@/1shared/const/branchSelectOptions";
import { ICommonWork } from "@/2entities/commonWork";
import { IPprData, TWorkBranch } from "@/2entities/ppr";

interface IInitialValues {
  branch: TWorkBranch;
  subbranch: string;
}

interface IWorkTableProps {
  data: ICommonWork[];
  onFinish?: () => void;
  initialValues: IInitialValues;
  subbranchOptions?: DefaultOptionType[];
  handleAddWork: (newWork: Partial<IPprData>) => void;
}

interface ISelectedWork extends Partial<ICommonWork> {
  branch: TWorkBranch;
  subbranch?: string;
}

const CLEAN_SELECTED_WORK: ISelectedWork = { branch: "exploitation" };

const COLUMNS: TableProps<ICommonWork>["columns"] = [
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

export const SelectWorkTable: FC<IWorkTableProps> = (props) => {
  const { data: credential } = useSession();

  const [dataSource, setDataSource] = useState(props.data);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [selectedWork, setSelectedWork] = useState<ISelectedWork>(props.initialValues);

  const selectedBranch = useMemo(() => selectedWork.branch, [selectedWork.branch]);

  const handleSelectBranch = (value: TWorkBranch) =>
    setSelectedWork((prev) => {
      return { ...prev, branch: value };
    });

  const selectedSubbranch = useMemo(() => [selectedWork.subbranch].filter(Boolean), [selectedWork.subbranch]);

  const handleSelectSubbranch = (tags: (string | undefined)[]) =>
    setSelectedWork((prev) => {
      return { ...prev, subbranch: tags[0] };
    });

  const onSearch: SearchProps["onSearch"] = (value: string) => {
    if (value) {
      setDataSource(props.data.filter((commonWork) => commonWork.name.toLowerCase().includes(value.toLowerCase())));
    } else {
      setDataSource(props.data);
    }
  };

  const handleFinish = () => {
    if (!selectedWork.id) {
      return;
    }

    props.handleAddWork({
      name: selectedWork.name,
      branch: selectedWork.branch,
      measure: selectedWork.measure,
      common_work_id: selectedWork.id,
      subbranch: selectedWork.subbranch,
      norm_of_time: selectedWork.normOfTime,
      unity: credential?.user.subdivisionShortName || "",
      norm_of_time_document: selectedWork.normOfTimeNameFull,
    });

    setSelectedRowKeys([]);
    setSelectedWork({ ...CLEAN_SELECTED_WORK, subbranch: selectedWork.subbranch });

    props.onFinish && props.onFinish();
  };

  const rowSelectionProp: TableRowSelection<ICommonWork> = {
    type: "radio",
    onChange: (selectedKeys: Key[], selectedRows: ICommonWork[]) => {
      setSelectedRowKeys(selectedKeys);
      setSelectedWork((prev) => ({ ...prev, ...selectedRows[0] }));
    },
    selectedRowKeys: selectedRowKeys,
  };

  useEffect(() => {
    setSelectedWork(props.initialValues);
  }, [props.initialValues]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 items-center">
        Категория работ:
        <Select
          className="flex-1"
          value={selectedBranch}
          onChange={handleSelectBranch}
          options={BRANCH_SELECT_OPTIONS}
        />
        Подкатегория работ:
        <Select
          className="flex-1"
          mode="tags"
          maxCount={1}
          value={selectedSubbranch}
          onChange={handleSelectSubbranch}
          options={props.subbranchOptions}
        />
      </div>
      <Search allowClear onSearch={onSearch} placeholder="Найти по наименованию" className="flex-1" />
      <TableAntd rowSelection={rowSelectionProp} dataSource={dataSource} columns={COLUMNS} rowKey={"id"} />
      <Button
        className="m-auto"
        onClick={handleFinish}
        type="primary"
        disabled={!Boolean(selectedWork.id && selectedWork.subbranch)}
      >
        Добавить
      </Button>
    </div>
  );
};
