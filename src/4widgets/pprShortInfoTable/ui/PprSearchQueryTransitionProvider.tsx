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

interface IPprSearchQueryTransitionProviderProps extends PropsWithChildren {}

// TODO: избавиться от компонента PprSearchTransitionProvider
export const PprSearchQueryTransitionProvider: FC<IPprSearchQueryTransitionProviderProps> = ({ children }) => {
  const [isLoading, startTransition] = useTransition();

  return (
    <PprSearchTransitionContext.Provider value={{ isLoading, startTransition }}>
      {children}
    </PprSearchTransitionContext.Provider>
  );
};

export const usePprSearchQueryTransition = () => useContext(PprSearchTransitionContext);
