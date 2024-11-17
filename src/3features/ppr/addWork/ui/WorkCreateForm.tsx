"use client";
import { FC, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Input from "antd/es/input";
import Select from "antd/es/select";
import Form from "antd/es/form";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import Button from "antd/es/button";

import { INearWorkMeta } from "@/1shared/providers/workModalProvider";
import { BRANCH_SELECT_OPTIONS } from "@/1shared/const/branchSelectOptions";
import { usePpr } from "@/1shared/providers/pprProvider";
import { TWorkBranch } from "@/2entities/ppr";
import { ICommonWork } from "@/2entities/commonWork/model/commonWork.types";

interface IWorkCreateNewWorkFormProps {
  onFinish?: () => void;
  nearWorkMeta: INearWorkMeta;
}

interface ICommonWorkExtended extends Omit<ICommonWork, "id"> {
  branch: TWorkBranch;
  subbranch: string[];
}

const BRANCH_INITIAL_VALUE: TWorkBranch = "exploitation";

export const WorkCreateForm: FC<IWorkCreateNewWorkFormProps> = ({ onFinish, nearWorkMeta }) => {
  const [form] = Form.useForm<ICommonWorkExtended>();

  const { data: credential } = useSession();

  const { addWork, pprMeta } = usePpr();

  const { subbranchesList } = pprMeta;

  const subbranchOptions = subbranchesList?.map((subbranch) => {
    return { value: subbranch, label: subbranch };
  });

  const handleFinish = (values: ICommonWorkExtended) => {
    addWork(
      {
        name: values.name,
        measure: values.measure,
        norm_of_time: values.normOfTime,
        norm_of_time_document: values.normOfTimeNameFull,
        branch: values.branch,
        subbranch: values.subbranch[0],
        unity: credential?.user.subdivisionShortName || "",
      },
      nearWorkMeta.workId
    );

    form.resetFields();
    onFinish && onFinish();
  };

  const initialValues = useMemo(() => {
    return {
      branch: nearWorkMeta.branch || BRANCH_INITIAL_VALUE,
      subbranch: nearWorkMeta.subbranch ? [nearWorkMeta.subbranch] : [],
    };
  }, [nearWorkMeta.branch, nearWorkMeta.subbranch]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  return (
    <Form<ICommonWorkExtended>
      form={form}
      name="create_new_work"
      onFinish={handleFinish}
      initialValues={initialValues}
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
