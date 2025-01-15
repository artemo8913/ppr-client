"use client";
import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import Button from "antd/es/button";
import { Table as TableAntd, TableProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import Search, { SearchProps } from "antd/es/input/Search";
import Select, { DefaultOptionType } from "antd/es/select";
import { Key, TableRowSelection } from "antd/es/table/interface";

import { BRANCH_SELECT_OPTIONS } from "@/1shared/const/branchSelectOptions";
import { ICommonWork } from "@/2entities/commonWork";
import { IPprBasicData, TWorkBranch } from "@/2entities/ppr";

export interface ISelectedWork extends Partial<Omit<ICommonWork, "id">> {
  note?: string;
  id?: number | null;
  branch: TWorkBranch;
  subbranch?: string;
}

interface IWorkTableProps {
  buttonLabel?: string;
  data: ICommonWork[];
  subbranchOptions?: DefaultOptionType[];
  initialValues: ISelectedWork;
  onFinish?: () => void;
  handleSubmit: (newWork: Partial<IPprBasicData>) => void;
}

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
  const [dataSource, setDataSource] = useState(props.data);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [selectedWork, setSelectedWork] = useState<ISelectedWork>(props.initialValues);

  const [note, setNote] = useState<string>(props.initialValues.note || "");

  const [searchValue, setSearchValue] = useState<string>(props.initialValues.note || "");

  const handleSelectBranch = (value: TWorkBranch) =>
    setSelectedWork((prev) => {
      return { ...prev, branch: value };
    });

  const subbranch = [selectedWork.subbranch].filter(Boolean);

  const handleSelectSubbranch = (tags: (string | undefined)[]) =>
    setSelectedWork((prev) => {
      return { ...prev, subbranch: tags[0] };
    });

  const handleChangeNote = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value), []);

  const handleSearchValue = useCallback((e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value), []);

  const handleSearch: SearchProps["onSearch"] = (searchValue: string) => {
    if (searchValue) {
      setDataSource(
        props.data.filter((commonWork) => {
          let result = false;
          const manyPhrases = searchValue.toLowerCase().split(" ");

          for (const onePhrase of manyPhrases) {
            if (commonWork.name.toLowerCase().includes(onePhrase)) {
              result = true;
            } else {
              result = false;
              break;
            }
          }

          return result;
        })
      );
    } else {
      setDataSource(props.data);
    }
  };

  const handleFinish = () => {
    if (!selectedWork.id) {
      return;
    }

    props.handleSubmit({
      note,
      name: selectedWork.name,
      branch: selectedWork.branch,
      measure: selectedWork.measure,
      common_work_id: selectedWork.id,
      subbranch: selectedWork.subbranch,
      norm_of_time: selectedWork.normOfTime,
      norm_of_time_document: selectedWork.normOfTimeNameFull,
    });

    setSelectedRowKeys([]);
    setSelectedWork({ branch: selectedWork.branch, subbranch: selectedWork.subbranch });
    setNote("");
    setSearchValue("");

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
    setNote(props.initialValues.note || "");

    if (props.initialValues.id) {
      setSelectedRowKeys([props.initialValues.id]);
      if (props.initialValues.name) {
        setSearchValue(props.initialValues.name);
        handleSearch(props.initialValues.name);
      }
    } else {
      setSelectedRowKeys([]);
      setSearchValue("");
      handleSearch("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.initialValues]);

  return (
    <div className="flex flex-col gap-2">
      <Search
        placeholder="Найти по наименованию"
        allowClear
        value={searchValue}
        defaultValue={searchValue}
        onSearch={handleSearch}
        onChange={handleSearchValue}
      />
      <TableAntd
        pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: [5, 10, 50, 100] }}
        rowSelection={rowSelectionProp}
        dataSource={dataSource}
        columns={COLUMNS}
        rowKey={"id"}
      />
      <div className="flex gap-4 items-center">
        Категория работ:
        <Select
          className="flex-1"
          value={selectedWork.branch}
          onChange={handleSelectBranch}
          options={BRANCH_SELECT_OPTIONS}
        />
        Подкатегория работ:
        <Select
          className="flex-1"
          mode="tags"
          maxCount={1}
          value={subbranch}
          onChange={handleSelectSubbranch}
          options={props.subbranchOptions}
        />
      </div>
      Примечание:
      <TextArea
        showCount
        maxLength={256}
        placeholder="Примечание"
        allowClear
        value={note}
        onChange={handleChangeNote}
      />
      <Button
        className="m-auto"
        onClick={handleFinish}
        type="primary"
        disabled={!Boolean(selectedWork.id && selectedWork.subbranch)}
      >
        {props.buttonLabel || "Добавить"}
      </Button>
    </div>
  );
};
