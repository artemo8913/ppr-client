import { DefaultOptionType } from "antd/es/select";

export type OptionType<T> = { value: T } & DefaultOptionType;
