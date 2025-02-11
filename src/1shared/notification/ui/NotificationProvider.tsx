"use client";
import { NotificationArgsProps } from "antd";
import useNotification from "antd/es/notification/useNotification";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo } from "react";

import { NotificationType } from "../model/notification.types";
import { translateRuNotificationType } from "../lib/notificationLocale";




type NotificationPlacement = NotificationArgsProps["placement"];

interface INoficationProviderContext {
  toast: (error: unknown, type?: NotificationType, placement?: NotificationPlacement) => void;
}

const INIT_CONTEXT: INoficationProviderContext = {
  toast: (error: unknown, type?: NotificationType, placement?: NotificationPlacement) => {},
};

const NoficationProviderContext = createContext<INoficationProviderContext>(INIT_CONTEXT);

export const useNotificationProvider = () => useContext(NoficationProviderContext);

export const NotificationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [api, contextHolder] = useNotification();

  //TODO: типизировать в проекте обработку сообщений от сервера к клиенту
  const toast = useCallback(
    (error: unknown, type: NotificationType = "info", placement: NotificationPlacement = "topRight") => {
      const { message } = error as Error;
      api[type]({
        message: translateRuNotificationType(type),
        description: <NoficationProviderContext.Consumer>{() => message}</NoficationProviderContext.Consumer>,
        placement,
      });
    },
    [api]
  );

  const contextValue = useMemo(() => ({ toast }), [toast]);

  return (
    <NoficationProviderContext.Provider value={contextValue}>
      {contextHolder}
      {children}
    </NoficationProviderContext.Provider>
  );
};
