import { TNotification } from "@/1shared/notification";

export interface IServerActionReturn<DataType = undefined> {
  code: number;
  data?: DataType;
  message: string;
  type: TNotification;
}
