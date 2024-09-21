import { TWorkBranch } from "@/2entities/ppr";

export const BRANCH_SELECT_OPTIONS: { value: TWorkBranch; label: string }[] = [
  { value: "exploitation", label: "Основные работы" },
  { value: "additional", label: "Дополнительные работы" },
  { value: "unforeseen", label: "Непредвиденные работы" },
];
