"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import type { GetRef, InputRef } from "antd";
import { Button, Form, Input, Popconfirm, Table } from "antd";
import { IWorkingManYearPlan } from "@/1shared/api/pprTable";
import { monthsIntlRu, pprTimePeriods } from "@/1shared/types/date";

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof IWorkingManYearPlan;
  record: IWorkingManYearPlan;
  handleSave: (record: IWorkingManYearPlan) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    childNode = isEditing ? (
      <Form.Item
        style={{ margin: 0, padding: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `введите значение`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const PeoplesTable: React.FC = () => {
  const [dataSource, setDataSource] = useState<IWorkingManYearPlan[]>([
    {
      id: "1",
      full_name: "Темыч",
      participation: 0.5,
      work_position: "Работяга",
      year_plan_time: 123,
      year_fact_time: 123,
      jan_plan_time: 123,
      jan_fact_time: 123,
    },
  ]);

  const [count, setCount] = useState(2);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.id !== key);
    setDataSource(newData);
  };

  type TColumnsIndexes = keyof IWorkingManYearPlan | "operation";
  type TColumns = (ColumnTypes[number] & { editable?: boolean; dataIndex?: TColumnsIndexes; children?: TColumns })[];

  const defaultColumns: TColumns = [
    {
      title: "Ф.И.О.",
      dataIndex: "full_name",
      width: "25%",
      editable: true,
    },
    {
      title: "Должность",
      dataIndex: "work_position",
      editable: true,
    },
    {
      title: "Доля участия",
      dataIndex: "participation",
      editable: true,
    },
    ...pprTimePeriods.map((time) => ({
      title: monthsIntlRu[time],
      editable: true,
      children: [
        { title: "план", dataIndex: `${time}_plan_time` as TColumnsIndexes, editable: true },
        { title: "факт", dataIndex: `${time}_fact_time` as TColumnsIndexes, editable: true },
      ],
    })),
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: IWorkingManYearPlan = {
      id: String(count),
      full_name: `Edward King ${count}`,
      participation: Math.random(),
      work_position: "Работяжечка",
      year_plan_time: 200,
      year_fact_time: 150,
      jan_plan_time: 100,
      jan_fact_time: 50,
      feb_plan_time: 100,
      feb_fact_time: 100,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row: IWorkingManYearPlan) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      children: col.children?.map((subCol) => {
        return {
          ...subCol,
          onCell: (record: IWorkingManYearPlan) => ({
            record,
            editable: subCol.editable,
            dataIndex: subCol.dataIndex,
            title: subCol.title,
            handleSave,
          }),
        };
      }),
      onCell: (record: IWorkingManYearPlan) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div className="overflow-auto">
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a row
      </Button>
      <Table
        className="w-[150%]"
        rowKey={"id"}
        pagination={false}
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
      />
    </div>
  );
};

export default PeoplesTable;
