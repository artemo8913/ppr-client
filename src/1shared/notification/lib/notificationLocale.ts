import { TNotification } from "../model/notification.types";

const NOTIFICATION_TYPE_RU: { [key in TNotification]: string } = {
  error: "Ошибка",
  info: "Информация",
  success: "Успех",
  warning: "Предупреждение",
};

export function translateRuNotificationType(type: TNotification): string | undefined {
  return NOTIFICATION_TYPE_RU[type];
}
