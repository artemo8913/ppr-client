import { PprTableUpdateButton } from "@/3features/pprTableUpdate";
import { FC } from "react";

interface IPprTableControlPanelProps {
  id: string;
}

export const PprTableControlPanel: FC<IPprTableControlPanelProps> = ({ id }) => {
  return (
    <div className="flex justify-start items-center sticky top-0 left-0 z-10 bg-slate-300">
      Ппр такого-то года, такого-то ЭЧК в таком-то статусе
      <PprTableUpdateButton id={id} />
    </div>
  );
};
