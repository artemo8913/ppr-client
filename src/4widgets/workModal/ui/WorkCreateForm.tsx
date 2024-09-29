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
import { ICommonWork } from "@/2entities/commonWork/model/commonWork.types";

interface IWorkCreateNewWorkFormProps {
  onFinish?: () => void;
  nearWorkId?: string | null;
}

interface ICommonWorkExtended extends Omit<ICommonWork, "id"> {
  branch: TWorkBranch;
  subbranch: string[];
}

const SELECT_INITIAL_VALUE: TWorkBranch = "exploitation";

export const WorkCreateForm: FC<IWorkCreateNewWorkFormProps> = ({ onFinish, nearWorkId }) => {
  const [form] = Form.useForm<ICommonWorkExtended>();

  const { addWork, getBranchesMeta } = usePpr();

  const { subbranchesList } = getBranchesMeta();

  const subbranchOptions = subbranchesList?.map((subbranch) => {
    return { value: subbranch, label: subbranch };
  });

  const handleFinish = (values: ICommonWorkExtended) => {
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
      <FormItem<ICommonWorkExtended>
        label="Наименование"
        name="name"
        rules={[{ required: true, message: "Введите наименование" }]}
      >
        <TextArea />
      </FormItem>
      <FormItem<ICommonWorkExtended>
        label="Единица измерения"
        name="measure"
        rules={[{ required: true, message: "Введите единицу измерения" }]}
      >
        <Input />
      </FormItem>
      <FormItem<ICommonWorkExtended>
        label="Норма времени"
        name="norm_of_time"
        rules={[{ required: true, message: "Введите норму времени" }]}
      >
        <Input type="number" />
      </FormItem>
      <FormItem<ICommonWorkExtended>
        label="Обоснование нормы времени"
        name="norm_of_time_document"
        rules={[{ required: true, message: "Введите документ, регламинтирующий норму времени" }]}
      >
        <Input />
      </FormItem>
      <FormItem<ICommonWorkExtended>
        label="Раздел ППР (категория работ)"
        name="branch"
        rules={[{ required: true, message: "Выберите раздел работ" }]}
      >
        <Select<TWorkBranch> defaultValue={SELECT_INITIAL_VALUE} options={BRANCH_SELECT_OPTIONS} />
      </FormItem>
      <FormItem<ICommonWorkExtended>
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
