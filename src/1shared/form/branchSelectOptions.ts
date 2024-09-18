import { TWorkBranch } from "@/2entities/ppr";

export const BRANCH_SELECT_OPTIONS: { value: TWorkBranch; label: string }[] = [
  { value: "exploitation", label: "Эксплуатационный план" },
  { value: "additional", label: "Дополнительные работы" },
  { value: "unforeseen", label: "Непредвиденные работы" },
  { value: "security", label: "Обеспечение работ" },
  { value: "none", label: "Прочие работы" },
];
