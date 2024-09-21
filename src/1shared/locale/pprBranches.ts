import { TWorkBranch } from "@/2entities/ppr";

const PPR_BRANCHES_RU: { [key in TWorkBranch]: string } = {
  additional: "Дополнительные работы",
  exploitation: "Основные (плановые) работы",
  unforeseen: "Непредвиденные работы",
};

export function translateRuPprBranchName(branch: string): string {
  if (branch in PPR_BRANCHES_RU) {
    return PPR_BRANCHES_RU[branch as TWorkBranch];
  }
  return branch;
}
