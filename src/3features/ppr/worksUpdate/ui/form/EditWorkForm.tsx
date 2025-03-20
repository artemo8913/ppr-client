"use client";
import { FC, useEffect } from "react";
import Form from "antd/es/form";
import Input from "antd/es/input";
import Button from "antd/es/button";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import TypedInputNumber from "antd/es/input-number";
import Select, { DefaultOptionType } from "antd/es/select";

import { ICommonWork } from "@/2entities/commonWork";
import { IPprBasicData, TWorkBranch } from "@/2entities/ppr";

import { BRANCH_SELECT_OPTIONS } from "../../lib/branchSelectOptions";

export interface IEditWorkFormInitialValues extends Partial<Omit<ICommonWork, "id">> {
  branch: TWorkBranch;
  subbranch?: string;
  note?: string;
}

interface IEditWorkForm extends Omit<ICommonWork, "id"> {
  branch: TWorkBranch;
  subbranch: string[];
  note: string;
}

interface IEditWorkFormProps {
  buttonLabel?: string;
  onFinish?: () => void;
  initialValues: IEditWorkFormInitialValues;
  subbranchOptions?: DefaultOptionType[];
  handleAddWork: (newWork: Partial<IPprBasicData>) => void;
}

export const EditWorkForm: FC<IEditWorkFormProps> = (props) => {
  const [form] = Form.useForm<IEditWorkForm>();

  const handleFinish = (values: IEditWorkForm) => {
    props.handleAddWork({
      name: values.name,
      note: values.note,
      common_work_id: null,
      branch: values.branch,
      measure: values.measure,
      subbranch: values.subbranch[0],
      norm_of_time: values.normOfTime,
      norm_of_time_document: values.normOfTimeNameFull,
    });

    form.resetFields();

    props.onFinish && props.onFinish();
  };

  useEffect(() => {
    form.setFieldsValue({
      ...props.initialValues,
      branch: props.initialValues.branch,
      subbranch: props.initialValues.subbranch ? [props.initialValues.subbranch] : [],
    });
  }, [form, props.initialValues]);

  return (
    <Form<IEditWorkForm> form={form} autoComplete="off" onFinish={handleFinish} initialValues={props.initialValues}>
      <FormItem<IEditWorkForm>
        label="Наименование"
        name="name"
        rules={[{ required: true, message: "Поле обязательно для заполнения" }]}
      >
        <TextArea showCount maxLength={256} />
      </FormItem>
      <FormItem<IEditWorkForm>
        label="Единица измерения"
        name="measure"
        rules={[{ required: true, message: "Поле обязательно для заполнения" }]}
      >
        <Input showCount maxLength={128} />
      </FormItem>
      <FormItem<IEditWorkForm>
        label="Норма времени"
        name="normOfTime"
        rules={[{ required: true, message: "Поле обязательно для заполнения" }]}
      >
        <TypedInputNumber style={{ width: "100%" }} min={0} max={9999.99} />
      </FormItem>
      <FormItem<IEditWorkForm>
        label="Обоснование нормы времени"
        name="normOfTimeNameFull"
        rules={[{ required: true, message: "Поле обязательно для заполнения" }]}
      >
        <TextArea showCount maxLength={256} />
      </FormItem>
      <FormItem<IEditWorkForm> label="Примечание" name="note">
        <TextArea showCount maxLength={256} />
      </FormItem>
      <FormItem<IEditWorkForm>
        label="Раздел ППР"
        name="branch"
        rules={[{ required: true, message: "Поле обязательно для заполнения" }]}
      >
        <Select<TWorkBranch> options={BRANCH_SELECT_OPTIONS} />
      </FormItem>
      <FormItem<IEditWorkForm>
        label="Пункт ППР"
        name="subbranch"
        rules={[{ required: true, message: "Поле обязательно для заполнения" }]}
      >
        <Select<string> mode="tags" maxCount={1} options={props.subbranchOptions} />
      </FormItem>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          {props.buttonLabel || "Добавить"}
        </Button>
      </Form.Item>
    </Form>
  );
};
