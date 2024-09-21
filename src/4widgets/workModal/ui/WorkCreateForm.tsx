"use client";
import { FC } from "react";
import Input from "antd/es/input";
import Select from "antd/es/select";
import Form from "antd/es/form";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import Button from "antd/es/button";

import { BRANCH_SELECT_OPTIONS } from "@/1shared/form/branchSelectOptions";
import { usePpr } from "@/1shared/providers/pprProvider";
import { TWorkBranch } from "@/2entities/ppr";
import { IWorkExtended } from "@/2entities/work";

interface IWorkCreateNewWorkFormProps {
  onFinish?: () => void;
  nearWorkId?: string | null;
}

type TAddWorkForm = Omit<IWorkExtended, "subbranch"> & { subbranch: string[] };

const SELECT_INITIAL_VALUE: TWorkBranch = "exploitation";

export const WorkCreateForm: FC<IWorkCreateNewWorkFormProps> = ({ onFinish, nearWorkId }) => {
  const [form] = Form.useForm<TAddWorkForm>();

  const { addWork, getBranchesMeta } = usePpr();

  const { subbranchesList } = getBranchesMeta();

  const subbranchOptions = subbranchesList?.map((subbranch) => {
    return { value: subbranch, label: subbranch };
  });

  const handleFinish = (values: TAddWorkForm) => {
    addWork({ ...values, subbranch: values.subbranch[0] }, nearWorkId);

    form.resetFields();
    onFinish && onFinish();
  };

  return (
    <Form
      form={form}
      name="create_new_work"
      onFinish={handleFinish}
      initialValues={{ remember: true, branch: SELECT_INITIAL_VALUE }}
      autoComplete="off"
    >
      <FormItem<TAddWorkForm>
        label="Наименование"
        name="name"
        rules={[{ required: true, message: "Введите наименование" }]}
      >
        <TextArea />
      </FormItem>
      <FormItem<TAddWorkForm>
        label="Единица измерения"
        name="measure"
        rules={[{ required: true, message: "Введите единицу измерения" }]}
      >
        <Input />
      </FormItem>
      <FormItem<TAddWorkForm>
        label="Норма времени"
        name="norm_of_time"
        rules={[{ required: true, message: "Введите норму времени" }]}
      >
        <Input type="number" />
      </FormItem>
      <FormItem<TAddWorkForm>
        label="Обоснование нормы времени"
        name="norm_of_time_document"
        rules={[{ required: true, message: "Введите документ, регламинтирующий норму времени" }]}
      >
        <Input />
      </FormItem>
      <FormItem<TAddWorkForm>
        label="Раздел ППР (категория работ)"
        name="branch"
        rules={[{ required: true, message: "Выберите раздел работ" }]}
      >
        <Select<TWorkBranch> defaultValue={SELECT_INITIAL_VALUE} options={BRANCH_SELECT_OPTIONS} />
      </FormItem>
      <FormItem<TAddWorkForm>
        label="Подраздел ППР (подраздел категории работ)"
        name="subbranch"
        rules={[{ required: true, message: "Выберите подраздел работ" }]}
      >
        <Select<string> mode="tags" maxCount={1} options={subbranchOptions} />
      </FormItem>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Добавить
        </Button>
      </Form.Item>
    </Form>
  );
};
