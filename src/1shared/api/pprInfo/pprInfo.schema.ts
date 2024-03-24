import { IPpr } from "../pprTable";

export interface IAddPprInfoRequest extends Omit<IPpr, "id"> {}
