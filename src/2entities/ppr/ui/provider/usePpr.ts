import { usePprData } from "./PprDataContext";
import { useWorksActions } from "./WorksActionsContext";
import { useWorkingMenActions } from "./WorkingMenActionsContext";

/**
 * Фасадный хук для обратной совместимости.
 * Объединяет все контексты в один объект.
 */
export const usePpr = () => {
  const { ppr, pprMeta } = usePprData();
  const worksActions = useWorksActions();
  const workingMenActions = useWorkingMenActions();

  return {
    // Данные
    ppr,
    pprMeta,

    // Действия над работами
    addWork: worksActions.addWork,
    copyWork: worksActions.copyWork,
    deleteWork: worksActions.deleteWork,
    editWork: worksActions.editWork,
    updatePprTableCell: worksActions.updatePprTableCell,
    updateTransfers: worksActions.updateTransfers,
    copyFactNormTimeToFactTime: worksActions.copyFactNormTimeToFactTime,
    setOneUnityInAllWorks: worksActions.setOneUnityInAllWorks,
    increaseWorkPosition: worksActions.increaseWorkPosition,
    decreaseWorkPosition: worksActions.decreaseWorkPosition,
    updateSubbranch: worksActions.updateSubbranch,
    updateRaportNote: worksActions.updateRaportNote,

    // Действия над работниками
    addWorkingMan: workingMenActions.addWorkingMan,
    deleteWorkingMan: workingMenActions.deleteWorkingMan,
    updateWorkingMan: workingMenActions.updateWorkingMan,
    updateWorkingManPlanNormTime: workingMenActions.updateWorkingManPlanNormTime,
    updateWorkingManPlanTabelTime: workingMenActions.updateWorkingManPlanTabelTime,
    updateWorkingManFactTime: workingMenActions.updateWorkingManFactTime,
    updateWorkingManParticipation: workingMenActions.updateWorkingManParticipation,
  };
};
