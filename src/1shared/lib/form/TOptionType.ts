import { DefaultOptionType } from "antd/es/select";
//TODO: в проекте везде переписать DefaultOptionType на OptionType
export type OptionType<T> = { value: T } & DefaultOptionType;
