"use client";
import React, { FC } from "react";
import clsx from "clsx";
import dayjs, { Dayjs } from "dayjs";
import Search from "antd/es/input/Search";
import DatePicker from "antd/es/date-picker";
import Select, { DefaultOptionType } from "antd/es/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { TDirection, TDistance, TSubdivision } from "@/2entities/division";
import { TPprShortInfo } from "@/2entities/ppr";
import { usePprSearchQueryTransition } from "./PprSearchQueryTransitionProvider";

interface IPprSearchQueryProps {
  divisions: { subdivisions: TSubdivision[]; distances: TDistance[]; directions: TDirection[] };
  className?: string;
}

export const PprSearchQuery: FC<IPprSearchQueryProps> = (props) => {
  const { isLoading, startTransition } = usePprSearchQueryTransition();

  const searchParams = useSearchParams();

  const pathname = usePathname();

  const { replace } = useRouter();

  const updateUrlSearchParam = (param: keyof TPprShortInfo, value: number | string | undefined) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(param, String(value));
    } else {
      params.delete(param);
    }

    startTransition(() => replace(`${pathname}?${params.toString()}`));
  };

  const idDirection = Number(searchParams.get("idDirection")) || null;
  const idDistance = Number(searchParams.get("idDistance")) || null;
  const idSubdivision = Number(searchParams.get("idSubdivision")) || null;

  const handleSearchName = (value: string) => updateUrlSearchParam("name", value);
  const handleSearchDirection = (value: number) => updateUrlSearchParam("idDirection", value);
  const handleSearchDistance = (value: number) => updateUrlSearchParam("idDistance", value);
  const handleSearchSubdivision = (value: number) => updateUrlSearchParam("idSubdivision", value);
  const handleSearchYear = (_date: Dayjs, dateString: string | string[]) =>
    typeof dateString === "string" && updateUrlSearchParam("year", dateString);

  const subdivisionOptions: DefaultOptionType[] = props.divisions.subdivisions
    .filter((subdivision) => (idDistance ? subdivision.idDistance === idDistance : true))
    .map((subdivision) => {
      return { label: subdivision.shortName, value: subdivision.id };
    });

  const distanceOptions: DefaultOptionType[] = props.divisions.distances
    .filter((subdivision) => (idDirection ? subdivision.idDirection === idDirection : true))
    .map((distance) => {
      return { label: distance.name, value: distance.id };
    });

  const directionOptions: DefaultOptionType[] = props.divisions.directions.map((direction) => {
    return { label: direction.shortName, value: direction.id };
  });

  return (
    <div className={clsx("flex gap-2 flex-wrap *:flex-auto", props.className)}>
      <Search
        value={searchParams.get("name")?.toString()}
        className="!basis-80"
        placeholder="Поиск по наименованию"
        onSearch={handleSearchName}
        disabled={isLoading}
        allowClear
      />
      <DatePicker
        value={searchParams.get("year") ? dayjs(searchParams.get("year")) : null}
        onChange={handleSearchYear}
        placeholder="Выберите год"
        picker="year"
        disabled={isLoading}
        allowClear
      />
      <Select
        value={idDirection}
        placeholder="Выберите дирекцию"
        onChange={handleSearchDirection}
        options={directionOptions}
        optionFilterProp="label"
        showSearch
        disabled={isLoading}
        allowClear
      />
      <Select
        value={idDistance}
        placeholder="Выберите дистанцию"
        onChange={handleSearchDistance}
        options={distanceOptions}
        optionFilterProp="label"
        showSearch
        disabled={isLoading}
        allowClear
      />
      <Select
        value={idSubdivision}
        placeholder="Выберите подразделение"
        onChange={handleSearchSubdivision}
        options={subdivisionOptions}
        optionFilterProp="label"
        showSearch
        disabled={isLoading}
        allowClear
      />
    </div>
  );
};
