"use client";
import useNotification from "antd/es/notification/useNotification";
import {
  FC,
  useMemo,
  useContext,
  useCallback,
  useTransition,
  createContext,
  PropsWithChildren,
} from "react";

import { ServerActionReturn } from "@/1shared/serverAction";

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

export const useTransitionWithToast = () => {
  const { toast } = useContext(NoficationProviderContext);

  const [isLoading, startTransition] = useTransition();

  const awaitServerActionAndToast = useCallback(
    (serverPromise: Promise<ServerActionReturn>) =>
      startTransition(async () => {
        const response = await serverPromise;
        toast(response);
      }),
    [toast]
  );

  return { isLoading, awaitServerActionAndToast };
};

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
