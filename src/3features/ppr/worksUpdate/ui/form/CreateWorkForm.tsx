"use client";
import { FC, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Form from "antd/es/form";
import Input from "antd/es/input";
import Button from "antd/es/button";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import Select, { DefaultOptionType } from "antd/es/select";

import { BRANCH_SELECT_OPTIONS } from "@/1shared/const/branchSelectOptions";
import { IPprData, TWorkBranch } from "@/2entities/ppr";
import { ICommonWork } from "@/2entities/commonWork/model/commonWork.types";

interface ICommonWorkExtended extends Omit<ICommonWork, "id"> {
  branch: TWorkBranch;
  subbranch: string[];
  note: string;
}

interface IInitialValues extends Partial<Omit<ICommonWork, "id">> {
  branch: TWorkBranch;
  subbranch: string;
}

interface IWorkCreateNewWorkFormProps {
  onFinish?: () => void;
  initialValues: IInitialValues;
  subbranchOptions?: DefaultOptionType[];
  handleAddWork: (newWork: Partial<IPprData>) => void;
}

export const CreateWorkForm: FC<IWorkCreateNewWorkFormProps> = (props) => {
  const [form] = Form.useForm<ICommonWorkExtended>();

  const { data: credential } = useSession();

  const handleFinish = (values: ICommonWorkExtended) => {
    props.handleAddWork({
      name: values.name,
      note: values.note,
      branch: values.branch,
      measure: values.measure,
      subbranch: values.subbranch[0],
      norm_of_time: values.normOfTime,
      norm_of_time_document: values.normOfTimeNameFull,
      unity: credential?.user.subdivisionShortName || "",
    });

    form.resetFields();

    props.onFinish && props.onFinish();
  };

  useEffect(() => {
    form.setFieldsValue({
      ...props.initialValues,
      subbranch: props.initialValues.subbranch ? [props.initialValues.subbranch] : [],
    });
  }, [form, props.initialValues]);

  return (
    <Form<ICommonWorkExtended>
      form={form}
      autoComplete="off"
      name="create_new_work"
      onFinish={handleFinish}
      initialValues={props.initialValues}
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
        name="normOfTime"
        rules={[{ required: true, message: "Введите норму времени" }]}
      >
        <Input type="number" />
      </FormItem>
      <FormItem<ICommonWorkExtended>
        label="Обоснование нормы времени"
        name="normOfTimeNameFull"
        rules={[{ required: true, message: "Введите документ, регламинтирующий норму времени" }]}
      >
        <Input />
      </FormItem>
      <FormItem<ICommonWorkExtended> label="Примечание" name="note">
        <TextArea />
      </FormItem>
      <FormItem<ICommonWorkExtended>
        label="Раздел ППР (категория работ)"
        name="branch"
        rules={[{ required: true, message: "Выберите раздел работ" }]}
      >
        <Select<TWorkBranch> options={BRANCH_SELECT_OPTIONS} />
      </FormItem>
      <FormItem<ICommonWorkExtended>
        label="Подраздел ППР (подраздел категории работ)"
        name="subbranch"
        rules={[{ required: true, message: "Выберите подраздел работ" }]}
      >
        <Select<string> mode="tags" maxCount={1} options={props.subbranchOptions} />
      </FormItem>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Добавить
        </Button>
      </Form.Item>
    </Form>
  );
};
