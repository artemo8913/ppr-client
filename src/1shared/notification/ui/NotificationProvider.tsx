"use client";
import useNotification from "antd/es/notification/useNotification";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo } from "react";

import { TNotification } from "../model/notification.types";
import { translateRuNotificationType } from "../lib/notificationLocale";

interface IToastParams {
  type: TNotification;
  message: string;
}

interface INoficationProviderContext {
  toast: (params: IToastParams) => void;
}

const INIT_CONTEXT: INoficationProviderContext = {
  toast: () => {},
};

const NoficationProviderContext = createContext<INoficationProviderContext>(INIT_CONTEXT);

export const useNotificationProvider = () => useContext(NoficationProviderContext);

export const NotificationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [api, contextHolder] = useNotification();

  const toast = useCallback(
    ({ type, message }: IToastParams) => {
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
