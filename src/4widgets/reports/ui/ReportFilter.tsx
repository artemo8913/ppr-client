"use client";
import { Dayjs } from "dayjs";
import Form from "antd/es/form";
import Button from "antd/es/button";
import Card from "antd/es/card/Card";
import FormItem from "antd/es/form/FormItem";
import DatePicker from "antd/es/date-picker";
import { FC, useEffect, useState, useTransition } from "react";
import Select, { DefaultOptionType } from "antd/es/select";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { OptionType } from "@/1shared/lib/form/TOptionType";
import { PPR_YEAR_OPTIONS, TYearPprStatus } from "@/2entities/ppr";
import { TDirection, TDistance, TDivisionType, TSubdivision } from "@/2entities/division";
import { ICommonWork } from "@/2entities/commonWork";

const DIVISIONS_TYPE_OPTIONS: OptionType<TDivisionType>[] = [
  { label: "Трансэнерго", value: "transenergo" },
  { label: "Дирекция", value: "direction" },
  { label: "Дистанция", value: "distance" },
  { label: "Подразделение", value: "subdivision" },
];

function getDivisionOptions(divisions: (TSubdivision | TDistance | TDirection)[]): DefaultOptionType[] {
  return divisions.map((division) => ({ value: division.id, label: division.name }));
}

interface IReportFilter {
  divisionType?: TDivisionType;
  year?: number;
  status?: TYearPprStatus;
  idSubdivision?: number;
  idDistance?: number;
  idDirection?: number;
  workId?: string;
}

type TReportFilterForm = Omit<IReportFilter, "year"> & { year: Dayjs };

interface IShowField {
  year: true;
  workName: boolean;
  division: boolean;
  pprYearStatus: boolean;
}

const SHOW_FIELD_DEFAULT: IShowField = {
  year: true,
  division: true,
  pprYearStatus: true,
  workName: true,
};

interface IReportFilterProps {
  commonWorks?: ICommonWork[];
  hasShowFields?: Partial<IShowField>;
  divisions: { subdivisions: TSubdivision[]; distances: TDistance[]; directions: TDirection[] };
}

export const ReportFilter: FC<IReportFilterProps> = ({ divisions, commonWorks, hasShowFields }) => {
  const [divisionType, setDivisionType] = useState(DIVISIONS_TYPE_OPTIONS[0].value);

  const [showFields] = useState({ ...SHOW_FIELD_DEFAULT, ...hasShowFields });

  const pathname = usePathname();

  const { replace } = useRouter();

  const searchParams = useSearchParams();

  const [isLoading, startTransition] = useTransition();

  const [form] = Form.useForm<TReportFilterForm>();

  const updateUrlSearchParams = (values: IReportFilter) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(values).forEach(([key, value]) => {
      value ? params.set(key, value) : params.delete(key);
    });

    Array.from(params.entries()).forEach(([param, _value]) => (param in values ? null : params.delete(param)));

    divisionType && params.set("divisionType", divisionType);

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleFinish = async (formValues: TReportFilterForm) => {
    const values: IReportFilter = {
      ...formValues,
      year: typeof formValues.year !== "number" ? formValues.year?.year() : formValues.year,
    };

    updateUrlSearchParams(values);
  };

  const commonWorksOptions: OptionType<number>[] =
    commonWorks?.map((work) => ({
      value: work.id,
      label: work.name,
    })) || [];

  useEffect(() => {
    searchParams;
  });

  return (
    <Card size="small">
      <Form<TReportFilterForm>
        className="flex flex-wrap gap-4 justify-between *:!mb-0"
        form={form}
        onFinish={handleFinish}
        disabled={isLoading}
      >
        <Form.Item<TReportFilterForm> hidden={!showFields.workName} className="w-full" name="workId">
          <Select
            placeholder="Выберите работу"
            showSearch
            allowClear
            optionFilterProp="label"
            options={commonWorksOptions}
          />
        </Form.Item>
        {showFields.division && (
          <Select
            value={divisionType}
            onChange={setDivisionType}
            options={DIVISIONS_TYPE_OPTIONS}
            placeholder="Выберите тип подразделения"
          />
        )}
        {divisionType === "direction" && (
          <Form.Item<TReportFilterForm> hidden={!showFields.division} name="idDirection">
            <Select
              placeholder="Выберите дирекцию"
              options={getDivisionOptions(divisions.directions)}
              optionFilterProp="label"
              showSearch
              allowClear
            />
          </Form.Item>
        )}
        {divisionType === "distance" && (
          <Form.Item<TReportFilterForm> hidden={!showFields.division} name="idDistance">
            <Select
              placeholder="Выберите дистанцию"
              options={getDivisionOptions(divisions.distances)}
              optionFilterProp="label"
              showSearch
              allowClear
            />
          </Form.Item>
        )}
        {divisionType === "subdivision" && (
          <Form.Item<TReportFilterForm> hidden={!showFields.division} name="idSubdivision">
            <Select
              placeholder="Выберите подразделение"
              options={getDivisionOptions(divisions.subdivisions)}
              optionFilterProp="label"
              showSearch
              allowClear
            />
          </Form.Item>
        )}
        <FormItem<TReportFilterForm> hidden={!showFields.pprYearStatus} name="status" label="Статус ЭУ-132">
          <Select placeholder="Выберите статус ЭУ-132" options={PPR_YEAR_OPTIONS} allowClear />
        </FormItem>
        <FormItem<TReportFilterForm> name="year" label="Год" rules={[{ required: true }]}>
          <DatePicker placeholder="Выберите год" picker="year" disabled={isLoading} allowClear />
        </FormItem>
        <Form.Item<TReportFilterForm>>
          <Button type="primary" htmlType="submit">
            Сформировать отчет
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
