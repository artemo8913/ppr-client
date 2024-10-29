"use client";
import { FC, PropsWithChildren, TransitionStartFunction, createContext, useContext, useTransition } from "react";

interface IPprSearchTransitionContext {
  isLoading: boolean;
  startTransition: TransitionStartFunction;
}

const PprSearchTransitionContext = createContext<IPprSearchTransitionContext>({
  isLoading: false,
  startTransition: () => {},
});

interface IPprSearchTransitionProviderProps extends PropsWithChildren {}

export const PprSearchTransitionProvider: FC<IPprSearchTransitionProviderProps> = ({ children }) => {
  const [isLoading, startTransition] = useTransition();

  return (
    <PprSearchTransitionContext.Provider value={{ isLoading, startTransition }}>
      {children}
    </PprSearchTransitionContext.Provider>
  );
};

export const usePprSearchTransition = () => useContext(PprSearchTransitionContext);
