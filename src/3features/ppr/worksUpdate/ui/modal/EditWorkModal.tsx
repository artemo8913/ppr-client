"use client";
import { FC } from "react";
import Tabs from "antd/es/tabs";
import Modal from "antd/es/modal/Modal";
import { useSession } from "next-auth/react";

import { usePpr } from "@/1shared/providers/pprProvider";
import { useWorkModal } from "@/1shared/providers/pprWorkModalProvider";
import { ICommonWork } from "@/2entities/commonWork";
import { IPprBasicData } from "@/2entities/ppr";

import { EditWorkForm, IEditWorkFormInitialValues } from "../form/EditWorkForm";
import { ISelectedWork, SelectWorkTable } from "../form/SelectWorkTable";

interface IEditModalProps extends React.ComponentProps<typeof Modal> {
  data: ICommonWork[];
}

export const EditWorkModal: FC<IEditModalProps> = ({ data }) => {
  const { closeEditWorkModal, isOpenEditWorkModal, workMeta } = useWorkModal();

  const { data: credential } = useSession();

  const {
    editWork,
    pprMeta: { subbranchesList },
  } = usePpr();

  const handleEditWork = (newWorkData: Partial<IPprBasicData>) => {
    editWork({ ...newWorkData, id: workMeta?.id, unity: credential?.user.subdivisionShortName || "" });
  };

  const subbranchOptions = subbranchesList?.map((subbranch) => {
    return { value: subbranch, label: subbranch };
  });

  const initialValuesForSelectTable: ISelectedWork = {
    id: workMeta?.common_work_id,
    normOfTime: workMeta?.norm_of_time,
    normOfTimeNameFull: workMeta?.norm_of_time_document,
    branch: workMeta?.branch,
    measure: workMeta?.measure,
    name: workMeta?.name,
    note: workMeta?.note,
    subbranch: workMeta?.subbranch,
  };

  const initialValuesForEditByUser: IEditWorkFormInitialValues = {
    branch: workMeta?.branch,
    note: workMeta?.note,
    subbranch: workMeta?.subbranch,
    measure: workMeta?.measure,
    name: workMeta?.name,
    normOfTime: workMeta?.norm_of_time,
    normOfTimeNameFull: workMeta?.norm_of_time_document,
  };

  return (
    <Modal
      title="Редактировать работу"
      width={1024}
      open={isOpenEditWorkModal}
      onCancel={closeEditWorkModal}
      footer={null}
    >
      <Tabs
        items={[
          {
            label: "Выбрать из перечня работ",
            key: "1",
            children: (
              <SelectWorkTable
                data={data}
                onFinish={closeEditWorkModal}
                handleSubmit={handleEditWork}
                initialValues={initialValuesForSelectTable}
                subbranchOptions={subbranchOptions}
                buttonLabel="Редактировать"
              />
            ),
          },
          {
            label: "Редактировать в ручную",
            key: "2",
            children: (
              <EditWorkForm
                onFinish={closeEditWorkModal}
                handleAddWork={handleEditWork}
                initialValues={initialValuesForEditByUser}
                subbranchOptions={subbranchOptions}
                buttonLabel="Редактировать"
              />
            ),
          },
        ]}
      />
    </Modal>
  );
};
