"use client";
import { FC } from "react";
import Input from "antd/es/input";
import Form from "antd/es/form";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import Button from "antd/es/button";
import { IWork } from "@/2entities/work";
import { usePprTableData } from "@/1shared/providers/pprTableProvider";

interface IWorkCreateNewWorkFormProps {
  onFinish?: () => void;
  indexToPlace?: number;
}

type TAddWorkForm = Omit<IWork, "periodicity_normal_data">;

export const WorkCreateForm: FC<IWorkCreateNewWorkFormProps> = ({ onFinish, indexToPlace }) => {
  const [form] = Form.useForm<TAddWorkForm>();
  const { addWork } = usePprTableData();
  const handleFinish = (values: TAddWorkForm) => {
    addWork(
      {
        ...values,
      },
      indexToPlace
    );
    form.resetFields();
    onFinish && onFinish();
  };

  return (
    <Form
      form={form}
      name="create_new_work"
      onFinish={handleFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      autoComplete="off"
    >
      <FormItem<TAddWorkForm>
        label="Наименование"
        name="name"
        rules={[{ required: true, message: "Введите наименование!" }]}
      >
        <TextArea />
      </FormItem>
      <FormItem<TAddWorkForm>
        label="Единица измерения"
        name="measure"
        rules={[{ required: true, message: "Введите единицу измерения!" }]}
      >
        <Input />
      </FormItem>
      <FormItem<TAddWorkForm>
        label="Норма времени"
        name="norm_of_time"
        rules={[{ required: true, message: "Введите норму времени!" }]}
      >
        <Input type="number" />
      </FormItem>
      <FormItem<TAddWorkForm>
        label="Обоснование нормы времени"
        name="norm_of_time_document"
        rules={[{ required: true, message: "Введите документ, регламинтирующий норму времени!" }]}
      >
        <Input />
      </FormItem>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Добавить
        </Button>
      </Form.Item>
    </Form>
  );
};
