"use client";
import { useSession } from "next-auth/react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import Search, { SearchProps } from "antd/es/input/Search";
import { Key, TableRowSelection } from "antd/es/table/interface";
import { Table as TableAntd, TableProps } from "antd";
import Button from "antd/es/button";
import Select from "antd/es/select";

import { INearWorkMeta } from "@/1shared/providers/workModalProvider";
import { BRANCH_SELECT_OPTIONS } from "@/1shared/const/branchSelectOptions";
import { usePpr } from "@/1shared/providers/pprProvider";
import { ICommonWork } from "@/2entities/commonWork";
import { TWorkBranch } from "@/2entities/ppr";

interface IWorkTableProps {
  nearWorkMeta: INearWorkMeta;
  data: ICommonWork[];
  onFinish?: () => void;
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

export const WorkSelectTable: FC<IWorkTableProps> = (props) => {
  const initialValues = useMemo(
    () => ({
      branch: props.nearWorkMeta.branch || CLEAN_SELECTED_WORK.branch,
      subbranch: props.nearWorkMeta.subbranch,
    }),
    [props.nearWorkMeta.branch, props.nearWorkMeta.subbranch]
  );

  const [dataSource, setDataSource] = useState(props.data);

  const { data: credential } = useSession();

  const { addWork, pprMeta } = usePpr();

  const { subbranchesList } = pprMeta;

  const subbranchOptions = useMemo(
    () =>
      subbranchesList?.map((subbranch) => {
        return { value: subbranch, label: subbranch };
      }),
    [subbranchesList]
  );

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [selectedWork, setSelectedWork] = useState<ISelectedWork>(initialValues);

  const selectedBranch = useMemo(() => selectedWork.branch, [selectedWork.branch]);

  const handleSelectBranch = useCallback(
    (value: TWorkBranch) =>
      setSelectedWork((prev) => {
        return { ...prev, branch: value };
      }),
    []
  );

  const selectedSubbranch = useMemo(() => [selectedWork.subbranch].filter(Boolean), [selectedWork.subbranch]);

  const handleSelectSubbranch = useCallback(
    (tags: (string | undefined)[]) =>
      setSelectedWork((prev) => {
        return { ...prev, subbranch: tags[0] };
      }),
    []
  );

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

    addWork(
      {
        common_work_id: selectedWork.id,
        name: selectedWork.name,
        branch: selectedWork.branch,
        subbranch: selectedWork.subbranch,
        measure: selectedWork.measure,
        norm_of_time: selectedWork.normOfTime,
        norm_of_time_document: selectedWork.normOfTimeNameFull,
        unity: credential?.user.subdivisionShortName || "",
      },
      props.nearWorkMeta.id
    );
    setSelectedRowKeys([]);
    setSelectedWork({ ...CLEAN_SELECTED_WORK, subbranch: selectedWork.subbranch });

    if (props.onFinish) {
      props.onFinish();
    }
  };

  useEffect(() => {
    setSelectedWork(initialValues);
  }, [initialValues]);

  const rowSelectionProp: TableRowSelection<ICommonWork> = useMemo(
    () => ({
      type: "radio",
      onChange: (selectedKeys: Key[], selectedRows: ICommonWork[]) => {
        setSelectedRowKeys(selectedKeys);
        setSelectedWork((prev) => ({ ...prev, ...selectedRows[0] }));
      },
      selectedRowKeys: selectedRowKeys,
    }),
    [selectedRowKeys]
  );

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
          options={subbranchOptions}
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
