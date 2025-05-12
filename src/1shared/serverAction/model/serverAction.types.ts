import { NotificationType } from "@/1shared/notification";

export interface ServerActionReturn<DataType = undefined> {
  code?: number;
  data?: DataType;
  message: string;
  type: NotificationType;
}
