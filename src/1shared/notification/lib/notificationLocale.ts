import { NotificationType } from "../model/notification.types";

const NOTIFICATION_TYPE_RU: { [key in NotificationType]: string } = {
  error: "Ошибка",
  info: "Информация",
  success: "Успех",
  warning: "Предупреждение",
};

export function translateRuNotificationType(type: NotificationType): string {
  return NOTIFICATION_TYPE_RU[type];
}
