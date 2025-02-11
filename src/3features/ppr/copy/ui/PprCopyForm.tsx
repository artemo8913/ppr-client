"use client";
import { Dayjs } from "dayjs";
import Form from "antd/es/form";
import { DatePicker } from "antd";
import Button from "antd/es/button";
import Input from "antd/es/input/Input";
import FormItem from "antd/es/form/FormItem";
import Checkbox from "antd/es/checkbox/Checkbox";
import { FC, useCallback, useState } from "react";

import { copyPprTable } from "@/2entities/ppr";

type TCopyPprForm = {
  name: string;
  year: Dayjs;
  isCopyPlanWork?: boolean;
  isCopyFactWork?: boolean;
  isCopyPlanWorkingMans?: boolean;
  isCopyFactWorkingMans?: boolean;
};

interface IPprCopyFormProps {
  pprId: number;
  onFinish?: () => void;
}

export const PprCopyForm: FC<IPprCopyFormProps> = ({ pprId, onFinish }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm<TCopyPprForm>();

  const handleFinish = useCallback(
    async (values: TCopyPprForm) => {
      setIsLoading(true);

      try {
        await copyPprTable({ ...values, instancePprId: pprId, year: values.year.year() });
      } catch (e) {
        console.log(e);
      }

      form.resetFields();

      if (onFinish) {
        onFinish();
      }
      setIsLoading(false);
    },
    [form, onFinish, pprId]
  );

  return (
    <Form
      form={form}
      name="copy_ppr"
      onFinish={handleFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      autoComplete="off"
      disabled={isLoading}
    >
      <FormItem<TCopyPprForm>
        label="Наименование"
        name="name"
        rules={[{ required: true, message: "Введите наименование" }]}
      >
        <Input />
      </FormItem>
      <FormItem<TCopyPprForm>
        label="Год"
        name="year"
        rules={[{ type: "object", required: true, message: "Выберите год" }]}
      >
        <DatePicker picker="year" />
      </FormItem>
      <FormItem<TCopyPprForm>
        label="Копировать запланированный объем работ"
        name="isCopyPlanWork"
        valuePropName="checked"
      >
        <Checkbox />
      </FormItem>
      <FormItem<TCopyPprForm> label="Копировать выполненный объем работ" name="isCopyFactWork" valuePropName="checked">
        <Checkbox />
      </FormItem>
      <FormItem<TCopyPprForm> label="Копировать план трудозатрат" name="isCopyPlanWorkingMans" valuePropName="checked">
        <Checkbox />
      </FormItem>
      <FormItem<TCopyPprForm> label="Копировать факт трудозатрат" name="isCopyFactWorkingMans" valuePropName="checked">
        <Checkbox />
      </FormItem>
      <FormItem<TCopyPprForm> wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Копировать
        </Button>
      </FormItem>
    </Form>
  );
};
