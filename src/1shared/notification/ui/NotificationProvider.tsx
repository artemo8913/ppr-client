"use client";
import useNotification from "antd/es/notification/useNotification";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo } from "react";

import { NotificationType } from "../model/notification.types";
import { translateRuNotificationType } from "../lib/notificationLocale";

interface ToastParams {
  type: NotificationType;
  message: string;
}

interface NoficationProviderContext {
  toast: (params: ToastParams) => void;
}

const INIT_CONTEXT: NoficationProviderContext = {
  toast: () => {},
};

const NoficationProviderContext = createContext<NoficationProviderContext>(INIT_CONTEXT);

export const useNotificationProvider = () => useContext(NoficationProviderContext);

export const NotificationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [api, contextHolder] = useNotification();

  const toast = useCallback(
    ({ type, message }: ToastParams) => {
      api[type]({
        message: translateRuNotificationType(type),
        description: <NoficationProviderContext.Consumer>{() => message}</NoficationProviderContext.Consumer>,
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
