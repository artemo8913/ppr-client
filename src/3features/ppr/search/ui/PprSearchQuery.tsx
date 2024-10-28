"use client";
import React, { ChangeEvent, FC } from "react";
import clsx from "clsx";
import dayjs, { Dayjs } from "dayjs";
import Search from "antd/es/input/Search";
import DatePicker from "antd/es/date-picker";
import Select, { DefaultOptionType } from "antd/es/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { TDirectionDB, TDistanceDB, TSubdivisionDB } from "@/1shared/database";
import { TPprShortInfo } from "@/2entities/ppr";

interface IPprSearchQueryProps {
  divisions: { subdivisions: TSubdivisionDB[]; distances: TDistanceDB[]; directions: TDirectionDB[] };
  className?: string;
}

export const PprSearchQuery: FC<IPprSearchQueryProps> = (props) => {
  const searchParams = useSearchParams();

  const pathname = usePathname();

  const { replace } = useRouter();

  const handleSearch = (param: keyof TPprShortInfo, value: number | string | undefined) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(param, String(value));
    } else {
      params.delete(param);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const idDirection = Number(searchParams.get("idDirection")) || null;
  const idDistance = Number(searchParams.get("idDistance")) || null;
  const idSubdivision = Number(searchParams.get("idSubdivision")) || null;

  const handleSearchName = (e: ChangeEvent<HTMLInputElement>) => handleSearch("name", e.target.value);
  const handleSearchDirection = (value: number) => handleSearch("idDirection", value);
  const handleSearchDistance = (value: number) => handleSearch("idDistance", value);
  const handleSearchSubdivision = (value: number) => handleSearch("idSubdivision", value);
  const handleSearchYear = (_date: Dayjs, dateString: string | string[]) =>
    typeof dateString === "string" && handleSearch("year", dateString);

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
    <div className={clsx("flex gap-2 *:flex-1", props.className)}>
      <Search
        defaultValue={searchParams.get("name")?.toString()}
        placeholder="Поиск по наименованию"
        onChange={handleSearchName}
        allowClear
      />
      <DatePicker
        defaultValue={searchParams.get("year") ? dayjs(searchParams.get("year")) : null}
        onChange={handleSearchYear}
        allowClear
        picker="year"
        placeholder="Выберите год"
      />
      <Select
        defaultValue={idDirection}
        placeholder="Выберите дирекцию"
        onChange={handleSearchDirection}
        options={directionOptions}
        optionFilterProp="label"
        showSearch
        allowClear
      />
      <Select
        defaultValue={idDistance}
        placeholder="Выберите дистанцию"
        onChange={handleSearchDistance}
        options={distanceOptions}
        optionFilterProp="label"
        showSearch
        allowClear
      />
      <Select
        defaultValue={idSubdivision}
        placeholder="Выберите подразделение"
        onChange={handleSearchSubdivision}
        options={subdivisionOptions}
        optionFilterProp="label"
        showSearch
        allowClear
      />
    </div>
  );
};
