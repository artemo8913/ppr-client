import { FC, PropsWithChildren } from "react";
import { ITableColumn } from "../model/tableSchema";

interface ITableTitleProps<T> {
  columns: ITableColumn<T>[];
}

export const TableTitle: <T>(props: PropsWithChildren<ITableTitleProps<T>>) => JSX.Element | null = (props) => {
  return <thead></thead>;
};
