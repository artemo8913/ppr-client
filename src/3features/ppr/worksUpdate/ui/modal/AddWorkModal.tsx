"use client";
import { FC } from "react";
import Tabs from "antd/es/tabs";
import Modal from "antd/es/modal/Modal";
import { useSession } from "next-auth/react";

import { ICommonWork } from "@/2entities/commonWork";
import { IPprBasicData, usePpr } from "@/2entities/ppr";

import { useWorkModal } from "./WorkModalProvider";
import { EditWorkForm } from "../form/EditWorkForm";
import { SelectWorkTable } from "../form/SelectWorkTable";

interface IAddWorkModalProps extends React.ComponentProps<typeof Modal> {
  data: ICommonWork[];
}

export const AddWorkModal: FC<IAddWorkModalProps> = ({ data }) => {
  const { closeAddWorkModal, isOpenAddWorkModal, workMeta } = useWorkModal();

  const {
    addWork,
    pprMeta: { subbranchesList },
  } = usePpr();

  const { data: credential } = useSession();

  const handleAddWork = (newWorkData: Partial<IPprBasicData>) => {
    addWork({ ...newWorkData, unity: credential?.user.subdivisionShortName || "" }, workMeta?.id);
  };

  const subbranchOptions = subbranchesList?.map((subbranch) => {
    return { value: subbranch, label: subbranch };
  });

  const initialValues = {
    branch: workMeta?.branch || "exploitation",
    subbranch: workMeta?.subbranch ? workMeta.subbranch : "",
  };

  return (
    <Modal title="Выберите работу" width={1024} open={isOpenAddWorkModal} onCancel={closeAddWorkModal} footer={null}>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Выбрать из перечня работ",
            key: "1",
            children: (
              <SelectWorkTable
                data={data}
                onFinish={closeAddWorkModal}
                handleSubmit={handleAddWork}
                initialValues={initialValues}
                subbranchOptions={subbranchOptions}
              />
            ),
          },
          {
            label: "Добавить самостоятельно",
            key: "2",
            children: (
              <EditWorkForm
                onFinish={closeAddWorkModal}
                handleAddWork={handleAddWork}
                initialValues={initialValues}
                subbranchOptions={subbranchOptions}
              />
            ),
          },
        ]}
      />
    </Modal>
  );
};
